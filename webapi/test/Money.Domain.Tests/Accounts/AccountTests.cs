using System;
using Shouldly;
using Xunit;

namespace Money.Accounts;

public class AccountTests
{
    [Fact]
    public void Should_Create_Account_With_Required_Fields()
    {
        var account = new Account(
            Guid.NewGuid(),
            "Questrade Margin",
            AccountType.NonRegistered,
            OwnerType.Personal,
            "123456",
            "Questrade"
        );

        account.Name.ShouldBe("Questrade Margin");
        account.AccountType.ShouldBe(AccountType.NonRegistered);
        account.OwnerType.ShouldBe(OwnerType.Personal);
        account.AccountNumber.ShouldBe("123456");
        account.BrokerOrInstitution.ShouldBe("Questrade");
    }

    [Fact]
    public void Should_Throw_When_Name_Is_Empty()
    {
        Should.Throw<ArgumentException>(() =>
            new Account(
                Guid.NewGuid(),
                "",
                AccountType.Cash,
                OwnerType.Personal,
                "1234",
                "Bank"
            )
        );
    }
}
