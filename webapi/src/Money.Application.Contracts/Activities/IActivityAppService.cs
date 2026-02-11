using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Money.Activities;

public interface IActivityAppService : IApplicationService
{
    Task<ActivityDto> GetAsync(Guid id);

    Task<PagedResultDto<ActivityDto>> GetListAsync(PagedAndSortedResultRequestDto input);

    Task<ActivityDto> CreateAsync(CreateActivityDto input);
}
