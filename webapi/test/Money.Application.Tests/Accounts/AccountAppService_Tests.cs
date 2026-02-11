using System;
using System.Linq;
using System.Threading.Tasks;
using Shouldly;
using Volo.Abp.Modularity;
using Volo.Abp.Validation;
using Xunit;

namespace Money.Accounts;

public abstract class AccountAppService_Tests<TStartupModule> : MoneyApplicationTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{
    private readonly IAccountAppService _accountAppService;

    protected AccountAppService_Tests()
    {
        _accountAppService = GetRequiredService<IAccountAppService>();
    }

    [Fact]
    public async Task Should_Create_Valid_Account()
    {
        var result = await _accountAppService.CreateAsync(new CreateAccountDto
        {
            Name = "Main CAD Account",
            AccountType = AccountType.Cash,
            OwnerType = OwnerType.Personal,
            AccountNumber = "ACC-1001",
            BrokerOrInstitution = "RBC"
        });

        result.Id.ShouldNotBe(Guid.Empty);
        result.Name.ShouldBe("Main CAD Account");
        result.AccountType.ShouldBe(AccountType.Cash);
        result.OwnerType.ShouldBe(OwnerType.Personal);
    }

    [Fact]
    public async Task Should_Not_Create_Account_Without_Name()
    {
        var exception = await Assert.ThrowsAsync<AbpValidationException>(async () =>
        {
            await _accountAppService.CreateAsync(new CreateAccountDto
            {
                Name = "",
                AccountType = AccountType.Cash,
                OwnerType = OwnerType.Personal,
                AccountNumber = "ACC-1002",
                BrokerOrInstitution = "RBC"
            });
        });

        exception.ValidationErrors.ShouldContain(err => err.MemberNames.Contains(nameof(CreateAccountDto.Name)));
    }
}
