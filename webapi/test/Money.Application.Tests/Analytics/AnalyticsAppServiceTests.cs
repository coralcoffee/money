using System;
using System.Threading.Tasks;
using Money.Accounts;
using Money.Activities;
using Shouldly;
using Volo.Abp.Modularity;
using Xunit;

namespace Money.Analytics;

public abstract class AnalyticsAppServiceTests<TStartupModule> : MoneyApplicationTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    private readonly IAccountAppService _accountAppService;
    private readonly IActivityAppService _activityAppService;
    private readonly IAnalyticsAppService _analyticsAppService;

    protected AnalyticsAppServiceTests()
    {
        _accountAppService = GetRequiredService<IAccountAppService>();
        _activityAppService = GetRequiredService<IActivityAppService>();
        _analyticsAppService = GetRequiredService<IAnalyticsAppService>();
    }

    [Fact]
    public async Task Should_Return_TotalInvested_TotalValue_TotalProfitLoss_In_Cad()
    {
        var baseline = await _analyticsAppService.GetSummaryAsync();

        var account = await _accountAppService.CreateAsync(new CreateAccountDto
        {
            Name = "Analytics Account",
            AccountType = AccountType.Cash,
            OwnerType = OwnerType.Personal,
            AccountNumber = "ANA-001",
            BrokerOrInstitution = "Questrade"
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Deposit,
            TradeDate = new DateTime(2026, 2, 1),
            Currency = "CAD",
            Amount = 1000m,
            FxRateToCad = 1m
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Buy,
            TradeDate = new DateTime(2026, 2, 2),
            Currency = "CAD",
            Amount = 500m,
            Quantity = 5m,
            Price = 100m,
            Fee = 1m,
            FxRateToCad = 1m,
            InstrumentSymbol = "XIU"
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Sell,
            TradeDate = new DateTime(2026, 2, 3),
            Currency = "CAD",
            Amount = 390m,
            Quantity = 3m,
            Price = 130m,
            Fee = 1m,
            FxRateToCad = 1m,
            InstrumentSymbol = "XIU"
        });

        var summary = await _analyticsAppService.GetSummaryAsync();

        (summary.TotalInvestedCad - baseline.TotalInvestedCad).ShouldBe(1000m);
        (summary.TotalValueCad - baseline.TotalValueCad).ShouldBe(1088.4m);
        (summary.TotalProfitLossCad - baseline.TotalProfitLossCad).ShouldBe(88.4m);
    }

    [Fact]
    public async Task Should_Return_Win_Loss_Rate_From_Closed_Trades()
    {
        var baseline = await _analyticsAppService.GetPerformanceAsync();

        var account = await _accountAppService.CreateAsync(new CreateAccountDto
        {
            Name = "Performance Account",
            AccountType = AccountType.Cash,
            OwnerType = OwnerType.Personal,
            AccountNumber = "ANA-002",
            BrokerOrInstitution = "Questrade"
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Deposit,
            TradeDate = new DateTime(2026, 2, 4),
            Currency = "CAD",
            Amount = 1000m,
            FxRateToCad = 1m
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Buy,
            TradeDate = new DateTime(2026, 2, 5),
            Currency = "CAD",
            Amount = 500m,
            Quantity = 5m,
            Price = 100m,
            FxRateToCad = 1m,
            InstrumentSymbol = "XIU"
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Sell,
            TradeDate = new DateTime(2026, 2, 6),
            Currency = "CAD",
            Amount = 450m,
            Quantity = 3m,
            Price = 150m,
            FxRateToCad = 1m,
            InstrumentSymbol = "XIU"
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Sell,
            TradeDate = new DateTime(2026, 2, 7),
            Currency = "CAD",
            Amount = 80m,
            Quantity = 1m,
            Price = 80m,
            FxRateToCad = 1m,
            InstrumentSymbol = "XIU"
        });

        var performance = await _analyticsAppService.GetPerformanceAsync();

        var closedDelta = performance.ClosedTrades - baseline.ClosedTrades;
        var winDelta = performance.WinningTrades - baseline.WinningTrades;
        var loseDelta = performance.LosingTrades - baseline.LosingTrades;

        closedDelta.ShouldBe(2);
        winDelta.ShouldBe(1);
        loseDelta.ShouldBe(1);
        ((decimal)winDelta / closedDelta).ShouldBe(0.5m);
    }
}
