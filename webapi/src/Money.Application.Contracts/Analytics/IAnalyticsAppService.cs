using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Money.Analytics;

public interface IAnalyticsAppService : IApplicationService
{
    Task<PortfolioSummaryDto> GetSummaryAsync();

    Task<PerformanceDto> GetPerformanceAsync();
}
