using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Money.Activities;
using Money.Positions;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Money.Analytics;

public class AnalyticsAppService : ApplicationService, IAnalyticsAppService
{
    private readonly IRepository<Activity, System.Guid> _activityRepository;
    private readonly FifoMatcher _fifoMatcher;

    public AnalyticsAppService(
        IRepository<Activity, System.Guid> activityRepository,
        FifoMatcher fifoMatcher)
    {
        _activityRepository = activityRepository;
        _fifoMatcher = fifoMatcher;
    }

    public async Task<PortfolioSummaryDto> GetSummaryAsync()
    {
        var state = await BuildPortfolioStateAsync();
        return new PortfolioSummaryDto
        {
            TotalInvestedCad = state.TotalInvestedCad,
            TotalValueCad = state.TotalValueCad,
            RealizedPnlCad = state.RealizedPnlCad,
            UnrealizedPnlCad = state.UnrealizedPnlCad,
            TotalProfitLossCad = state.TotalProfitLossCad
        };
    }

    public async Task<PerformanceDto> GetPerformanceAsync()
    {
        var state = await BuildPortfolioStateAsync();
        return new PerformanceDto
        {
            ClosedTrades = state.ClosedTrades,
            WinningTrades = state.WinningTrades,
            LosingTrades = state.LosingTrades,
            WinRate = state.ClosedTrades == 0 ? 0 : (decimal)state.WinningTrades / state.ClosedTrades,
            RealizedPnlCad = state.RealizedPnlCad,
            UnrealizedPnlCad = state.UnrealizedPnlCad,
            TotalProfitLossCad = state.TotalProfitLossCad
        };
    }

    private async Task<PortfolioState> BuildPortfolioStateAsync()
    {
        var activities = await _activityRepository.GetListAsync();
        var ordered = activities.OrderBy(x => x.TradeDate).ThenBy(x => x.CreationTime).ToList();

        decimal cashCad = 0;
        decimal totalInvestedCad = 0;
        decimal realizedPnlCad = 0;
        int closedTrades = 0;
        int winningTrades = 0;
        int losingTrades = 0;

        var lotsByKey = new Dictionary<string, List<PositionLot>>();

        foreach (var activity in ordered)
        {
            var rate = activity.FxRateToCad;
            var feeCad = (activity.Fee ?? 0) * rate;
            var amountCad = activity.Amount * rate;

            switch (activity.Type)
            {
                case ActivityType.Deposit:
                    totalInvestedCad += amountCad;
                    cashCad += amountCad;
                    break;
                case ActivityType.Withdraw:
                    totalInvestedCad -= amountCad;
                    cashCad -= amountCad;
                    break;
                case ActivityType.Expense:
                    cashCad -= amountCad;
                    break;
                case ActivityType.Dividend:
                    cashCad += amountCad;
                    break;
                case ActivityType.Fee:
                    cashCad -= amountCad;
                    break;
                case ActivityType.Buy:
                    if (!activity.Quantity.HasValue || !activity.Price.HasValue || string.IsNullOrWhiteSpace(activity.InstrumentSymbol))
                    {
                        break;
                    }

                    var buyNotionalCad = activity.Quantity.Value * activity.Price.Value * rate;
                    cashCad -= (buyNotionalCad + feeCad);

                    var lotKey = GetLotKey(activity);
                    if (!lotsByKey.TryGetValue(lotKey, out var buyLots))
                    {
                        buyLots = new List<PositionLot>();
                        lotsByKey[lotKey] = buyLots;
                    }

                    var unitCostCad = (buyNotionalCad + feeCad) / activity.Quantity.Value;
                    buyLots.Add(new PositionLot(activity.Id, activity.TradeDate, activity.Quantity.Value, unitCostCad));
                    break;
                case ActivityType.Sell:
                    if (!activity.Quantity.HasValue || !activity.Price.HasValue || string.IsNullOrWhiteSpace(activity.InstrumentSymbol))
                    {
                        break;
                    }

                    var sellNotionalCad = activity.Quantity.Value * activity.Price.Value * rate;
                    cashCad += (sellNotionalCad - feeCad);

                    var sellKey = GetLotKey(activity);
                    if (!lotsByKey.TryGetValue(sellKey, out var sellLots))
                    {
                        sellLots = new List<PositionLot>();
                        lotsByKey[sellKey] = sellLots;
                    }

                    var match = _fifoMatcher.MatchSell(sellLots, activity.Quantity.Value, activity.Price.Value * rate, feeCad);
                    realizedPnlCad += match.RealizedPnlCad;
                    closedTrades += 1;
                    if (match.RealizedPnlCad > 0)
                    {
                        winningTrades += 1;
                    }
                    else if (match.RealizedPnlCad < 0)
                    {
                        losingTrades += 1;
                    }
                    break;
            }
        }

        var openLotsCostCad = lotsByKey.Values
            .SelectMany(x => x)
            .Sum(x => x.RemainingQuantity * x.UnitCostCad);

        var unrealizedPnlCad = 0m;
        var totalValueCad = cashCad + openLotsCostCad;
        var totalProfitLossCad = realizedPnlCad + unrealizedPnlCad;

        return new PortfolioState(
            totalInvestedCad,
            totalValueCad,
            realizedPnlCad,
            unrealizedPnlCad,
            totalProfitLossCad,
            closedTrades,
            winningTrades,
            losingTrades
        );
    }

    private static string GetLotKey(Activity activity)
    {
        return $"{activity.AccountId:N}:{activity.InstrumentSymbol}";
    }

    private sealed record PortfolioState(
        decimal TotalInvestedCad,
        decimal TotalValueCad,
        decimal RealizedPnlCad,
        decimal UnrealizedPnlCad,
        decimal TotalProfitLossCad,
        int ClosedTrades,
        int WinningTrades,
        int LosingTrades);
}
