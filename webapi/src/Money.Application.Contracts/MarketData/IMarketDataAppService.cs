using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Money.MarketData;

public interface IMarketDataAppService : IApplicationService
{
    Task RefreshAsync();

    Task<MarketDataStatusDto> GetStatusAsync();
}
