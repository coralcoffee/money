using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Money.Activities;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;

namespace Money.MarketData;

public class MarketDataRefreshJob : ApplicationService
{
    private readonly IRepository<Activity, Guid> _activityRepository;
    private readonly IRepository<DailyMarketPrice, Guid> _dailyPriceRepository;
    private readonly IRepository<InstrumentFundamentalSnapshot, Guid> _fundamentalRepository;
    private readonly IMarketDataClient _marketDataClient;
    private readonly MarketDataRefreshState _state;

    public MarketDataRefreshJob(
        IRepository<Activity, Guid> activityRepository,
        IRepository<DailyMarketPrice, Guid> dailyPriceRepository,
        IRepository<InstrumentFundamentalSnapshot, Guid> fundamentalRepository,
        IMarketDataClient marketDataClient,
        MarketDataRefreshState state)
    {
        _activityRepository = activityRepository;
        _dailyPriceRepository = dailyPriceRepository;
        _fundamentalRepository = fundamentalRepository;
        _marketDataClient = marketDataClient;
        _state = state;
    }

    public async Task RefreshAsync(CancellationToken cancellationToken = default)
    {
        using var uow = UnitOfWorkManager.Begin(new AbpUnitOfWorkOptions(), requiresNew: true);
        _state.MarkStarted();

        try
        {
            var trackedSymbols = (await _activityRepository.GetListAsync())
                .Where(x => x.Type is ActivityType.Buy or ActivityType.Sell)
                .Select(x => x.InstrumentSymbol)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x!.Trim().ToUpperInvariant())
                .Distinct()
                .ToList();

            var date = DateOnly.FromDateTime(DateTime.UtcNow);

            foreach (var symbol in trackedSymbols)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var quote = await _marketDataClient.GetDailyQuoteAsync(symbol, date, cancellationToken);
                var fundamentals = await _marketDataClient.GetFundamentalsAsync(symbol, cancellationToken);

                var existingQuote = await _dailyPriceRepository.FirstOrDefaultAsync(
                    x => x.Symbol == symbol && x.Date == date,
                    cancellationToken: cancellationToken
                );

                if (existingQuote == null)
                {
                    await _dailyPriceRepository.InsertAsync(
                        new DailyMarketPrice(GuidGenerator.Create(), symbol, date, quote.Currency, quote.Close),
                        cancellationToken: cancellationToken
                    );
                }

                var existingFundamental = await _fundamentalRepository.FirstOrDefaultAsync(
                    x => x.Symbol == symbol && x.Date == date,
                    cancellationToken: cancellationToken
                );

                if (existingFundamental == null)
                {
                    await _fundamentalRepository.InsertAsync(
                        new InstrumentFundamentalSnapshot(
                            GuidGenerator.Create(),
                            symbol,
                            date,
                            fundamentals.MarketCap,
                            fundamentals.TrailingPe
                        ),
                        cancellationToken: cancellationToken
                    );
                }
            }

            _state.MarkCompleted(trackedSymbols.Count);
            await uow.CompleteAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _state.MarkFailed(ex);
            throw;
        }
    }
}
