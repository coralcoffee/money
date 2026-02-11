using System;
using System.Threading.Tasks;
using Money.Accounts;
using Money.Activities;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Money.EntityFrameworkCore.Investments;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class InvestmentRepositoryTests : MoneyEntityFrameworkCoreTestBase
{
    private readonly IRepository<Account, Guid> _accountRepository;
    private readonly IRepository<Activity, Guid> _activityRepository;

    public InvestmentRepositoryTests()
    {
        _accountRepository = GetRequiredService<IRepository<Account, Guid>>();
        _activityRepository = GetRequiredService<IRepository<Activity, Guid>>();
    }

    [Fact]
    public async Task Should_Persist_Account_And_Activity()
    {
        var accountId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            var account = new Account(
                accountId,
                "Integration Account",
                AccountType.Cash,
                OwnerType.Personal,
                "INT-001",
                "Test Broker"
            );
            await _accountRepository.InsertAsync(account);

            var activity = new Activity(
                Guid.NewGuid(),
                accountId,
                ActivityType.Deposit,
                DateTime.UtcNow,
                "CAD",
                100m,
                null,
                null,
                null,
                1m,
                null,
                null
            );
            await _activityRepository.InsertAsync(activity);
        });

        await WithUnitOfWorkAsync(async () =>
        {
            var account = await _accountRepository.GetAsync(accountId);
            var activity = await _activityRepository.FirstOrDefaultAsync(x => x.AccountId == accountId);

            account.Name.ShouldBe("Integration Account");
            activity.ShouldNotBeNull();
            activity.Type.ShouldBe(ActivityType.Deposit);
        });
    }
}
