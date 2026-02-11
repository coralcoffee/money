using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Money.Permissions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using System.Linq.Dynamic.Core;

namespace Money.Activities;

[Authorize(MoneyPermissions.Activities.Default)]
public class ActivityAppService : ApplicationService, IActivityAppService
{
    private readonly IRepository<Activity, Guid> _repository;

    public ActivityAppService(IRepository<Activity, Guid> repository)
    {
        _repository = repository;
    }

    public async Task<ActivityDto> GetAsync(Guid id)
    {
        var activity = await _repository.GetAsync(id);
        return ObjectMapper.Map<Activity, ActivityDto>(activity);
    }

    public async Task<PagedResultDto<ActivityDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await _repository.GetQueryableAsync();
        var query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "TradeDate desc" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var activities = await AsyncExecuter.ToListAsync(query);
        var totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<ActivityDto>(
            totalCount,
            ObjectMapper.Map<List<Activity>, List<ActivityDto>>(activities)
        );
    }

    [Authorize(MoneyPermissions.Activities.Create)]
    public async Task<ActivityDto> CreateAsync(CreateActivityDto input)
    {
        var activity = new Activity(
            GuidGenerator.Create(),
            input.AccountId,
            input.Type,
            input.TradeDate,
            input.Currency,
            input.Amount,
            input.Quantity,
            input.Price,
            input.Fee,
            input.FxRateToCad,
            input.InstrumentSymbol,
            input.Notes
        );

        await _repository.InsertAsync(activity);
        return ObjectMapper.Map<Activity, ActivityDto>(activity);
    }
}
