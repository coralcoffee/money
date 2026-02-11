using System;
using Volo.Abp.Application.Dtos;

namespace Money.Accounts;

public class AccountDto : AuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;

    public AccountType AccountType { get; set; }

    public OwnerType OwnerType { get; set; }

    public string AccountNumber { get; set; } = string.Empty;

    public string BrokerOrInstitution { get; set; } = string.Empty;
}
