using System;
using System.Threading.Tasks;
using Money.Accounts;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Modularity;
using Xunit;

namespace Money.Activities;

public abstract class ActivityAppServiceTests<TStartupModule> : MoneyApplicationTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    private readonly IActivityAppService _activityAppService;
    private readonly IAccountAppService _accountAppService;

    protected ActivityAppServiceTests()
    {
        _activityAppService = GetRequiredService<IActivityAppService>();
        _accountAppService = GetRequiredService<IAccountAppService>();
    }

    [Fact]
    public async Task Should_Create_Deposit_Activity()
    {
        var account = await _accountAppService.CreateAsync(new CreateAccountDto
        {
            Name = "Trading USD",
            AccountType = AccountType.Cash,
            OwnerType = OwnerType.Personal,
            AccountNumber = "USD-ACC-01",
            BrokerOrInstitution = "Questrade"
        });

        var activity = await _activityAppService.CreateAsync(new CreateActivityDto
        {
            AccountId = account.Id,
            Type = ActivityType.Deposit,
            TradeDate = DateTime.UtcNow,
            Currency = "USD",
            Amount = 1000m,
            FxRateToCad = 1.35m
        });

        activity.Id.ShouldNotBe(Guid.Empty);
        activity.Type.ShouldBe(ActivityType.Deposit);
        activity.Quantity.ShouldBeNull();
    }

    [Fact]
    public async Task Should_Reject_Invalid_Buy_Activity()
    {
        var account = await _accountAppService.CreateAsync(new CreateAccountDto
        {
            Name = "Trading CAD",
            AccountType = AccountType.Cash,
            OwnerType = OwnerType.Personal,
            AccountNumber = "CAD-ACC-01",
            BrokerOrInstitution = "Questrade"
        });

        await Should.ThrowAsync<BusinessException>(async () =>
            await _activityAppService.CreateAsync(new CreateActivityDto
            {
                AccountId = account.Id,
                Type = ActivityType.Buy,
                TradeDate = DateTime.UtcNow,
                Currency = "USD",
                Amount = 1000m,
                FxRateToCad = 1.35m
            })
        );
    }
}
