using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Money.Permissions;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Money.Accounts;

[Authorize(MoneyPermissions.Accounts.Default)]
public class AccountAppService :
    CrudAppService<Account, AccountDto, Guid, PagedAndSortedResultRequestDto, CreateAccountDto>,
    IAccountAppService
{
    public AccountAppService(IRepository<Account, Guid> repository)
        : base(repository)
    {
        GetPolicyName = MoneyPermissions.Accounts.Default;
        GetListPolicyName = MoneyPermissions.Accounts.Default;
        CreatePolicyName = MoneyPermissions.Accounts.Create;
        UpdatePolicyName = MoneyPermissions.Accounts.Edit;
        DeletePolicyName = MoneyPermissions.Accounts.Delete;
    }

    protected override Task<Account> MapToEntityAsync(CreateAccountDto createInput)
    {
        return Task.FromResult(new Account(
            GuidGenerator.Create(),
            createInput.Name,
            createInput.AccountType,
            createInput.OwnerType,
            createInput.AccountNumber,
            createInput.BrokerOrInstitution
        ));
    }

    protected override Task MapToEntityAsync(CreateAccountDto updateInput, Account entity)
    {
        Check.NotNull(entity, nameof(entity));

        entity.SetName(updateInput.Name);
        entity.SetAccountType(updateInput.AccountType);
        entity.SetOwnerType(updateInput.OwnerType);
        entity.SetAccountNumber(updateInput.AccountNumber);
        entity.SetBrokerOrInstitution(updateInput.BrokerOrInstitution);

        return Task.CompletedTask;
    }
}
