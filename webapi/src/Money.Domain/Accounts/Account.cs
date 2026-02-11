using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Money.Accounts;

public class Account : AuditedAggregateRoot<Guid>
{
    public string Name { get; private set; }

    public AccountType AccountType { get; private set; }

    public OwnerType OwnerType { get; private set; }

    public string AccountNumber { get; private set; }

    public string BrokerOrInstitution { get; private set; }

    protected Account()
    {
        Name = string.Empty;
        AccountNumber = string.Empty;
        BrokerOrInstitution = string.Empty;
    }

    public Account(
        Guid id,
        string name,
        AccountType accountType,
        OwnerType ownerType,
        string accountNumber,
        string brokerOrInstitution)
        : base(id)
    {
        SetName(name);
        SetAccountNumber(accountNumber);
        SetBrokerOrInstitution(brokerOrInstitution);
        AccountType = accountType;
        OwnerType = ownerType;
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), AccountConsts.NameMaxLength);
    }

    public void SetAccountType(AccountType accountType)
    {
        AccountType = accountType;
    }

    public void SetOwnerType(OwnerType ownerType)
    {
        OwnerType = ownerType;
    }

    public void SetAccountNumber(string accountNumber)
    {
        AccountNumber = Check.NotNullOrWhiteSpace(
            accountNumber,
            nameof(accountNumber),
            AccountConsts.AccountNumberMaxLength
        );
    }

    public void SetBrokerOrInstitution(string brokerOrInstitution)
    {
        BrokerOrInstitution = Check.NotNullOrWhiteSpace(
            brokerOrInstitution,
            nameof(brokerOrInstitution),
            AccountConsts.BrokerOrInstitutionMaxLength
        );
    }
}
