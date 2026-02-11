using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Money.Accounts;

public interface IAccountAppService :
    ICrudAppService<
        AccountDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateAccountDto>
{
}
