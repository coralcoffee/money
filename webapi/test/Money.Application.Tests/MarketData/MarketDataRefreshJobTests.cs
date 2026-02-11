using System;
using System.Threading.Tasks;
using Money.Accounts;
using Money.Activities;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Modularity;
using Xunit;

namespace Money.MarketData;

public abstract class MarketDataRefreshJobTests<TStartupModule> : MoneyApplicationTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    private readonly IAccountAppService _accountAppService;
    private readonly IActivityAppService _activityAppService;
    private readonly MarketDataRefreshJob _refreshJob;
    private readonly IRepository<DailyMarketPrice, Guid> _priceRepository;
    private readonly IRepository<InstrumentFundamentalSnapshot, Guid> _fundamentalRepository;

    protected MarketDataRefreshJobTests()
    {
        _accountAppService = GetRequiredService<IAccountAppService>();
        _activityAppService = GetRequiredService<IActivityAppService>();
        _refreshJob = GetRequiredService<MarketDataRefreshJob>();
        _priceRepository = GetRequiredService<IRepository<DailyMarketPrice, Guid>>();
        _fundamentalRepository = GetRequiredService<IRepository<InstrumentFundamentalSnapshot, Guid>>();
    }

    [Fact]
    public async Task Should_Save_Daily_Close_For_Tracked_Symbols()
    {
        var account = await _accountAppService.CreateAsync(new CreateAccountDto
        {
            Name = "Market Data Account",
            AccountType = AccountType.Cash,
            OwnerType = OwnerType.Personal,
            AccountNumber = "MD-001",
            BrokerOrInstitution = "Questrade"
        });

        await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Buy,
            TradeDate = DateTime.UtcNow,
            Currency = "USD",
            Amount = 1000m,
            Quantity = 10m,
            Price = 100m,
            FxRateToCad = 1.35m,
            InstrumentSymbol = "VOO"
        });

        await _refreshJob.RefreshAsync();

        await WithUnitOfWorkAsync(async () =>
        {
            var quote = await _priceRepository.FirstOrDefaultAsync(x => x.Symbol == "VOO");
            var fundamental = await _fundamentalRepository.FirstOrDefaultAsync(x => x.Symbol == "VOO");

            quote.ShouldNotBeNull();
            fundamental.ShouldNotBeNull();
        });
    }
}
