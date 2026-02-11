using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Money.MarketData;

namespace Money.Controllers;

[Route("api/marketdata")]
public class MarketDataController : MoneyController
{
    private readonly IMarketDataAppService _marketDataAppService;

    public MarketDataController(IMarketDataAppService marketDataAppService)
    {
        _marketDataAppService = marketDataAppService;
    }

    [HttpPost("refresh")]
    public async Task RefreshAsync()
    {
        await _marketDataAppService.RefreshAsync();
    }

    [HttpGet("status")]
    public Task<MarketDataStatusDto> GetStatusAsync()
    {
        return _marketDataAppService.GetStatusAsync();
    }
}
