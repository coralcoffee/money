using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Money.MarketData;

public class MarketDataAppService : ApplicationService, IMarketDataAppService
{
    private readonly MarketDataRefreshJob _refreshJob;
    private readonly MarketDataRefreshState _state;

    public MarketDataAppService(MarketDataRefreshJob refreshJob, MarketDataRefreshState state)
    {
        _refreshJob = refreshJob;
        _state = state;
    }

    public async Task RefreshAsync()
    {
        await _refreshJob.RefreshAsync();
    }

    public Task<MarketDataStatusDto> GetStatusAsync()
    {
        return Task.FromResult(new MarketDataStatusDto
        {
            LastRefreshStartedAtUtc = _state.LastRefreshStartedAtUtc,
            LastRefreshCompletedAtUtc = _state.LastRefreshCompletedAtUtc,
            LastRefreshSucceeded = _state.LastRefreshSucceeded,
            LastRefreshSymbolCount = _state.LastRefreshSymbolCount,
            LastError = _state.LastError
        });
    }
}
