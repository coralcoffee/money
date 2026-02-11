using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Money.Analytics;

namespace Money.Controllers;

[Route("api/analytics")]
public class AnalyticsController : MoneyController
{
    private readonly IAnalyticsAppService _analyticsAppService;

    public AnalyticsController(IAnalyticsAppService analyticsAppService)
    {
        _analyticsAppService = analyticsAppService;
    }

    [HttpGet("summary")]
    public Task<PortfolioSummaryDto> GetSummaryAsync()
    {
        return _analyticsAppService.GetSummaryAsync();
    }

    [HttpGet("performance")]
    public Task<PerformanceDto> GetPerformanceAsync()
    {
        return _analyticsAppService.GetPerformanceAsync();
    }
}
