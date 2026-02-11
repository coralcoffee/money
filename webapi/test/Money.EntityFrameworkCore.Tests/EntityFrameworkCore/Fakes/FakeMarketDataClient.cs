using System;
using System.Threading;
using System.Threading.Tasks;
using Money.MarketData;

namespace Money.EntityFrameworkCore.Fakes;

public class FakeMarketDataClient : IMarketDataClient
{
    public Task<DailyQuoteResult> GetDailyQuoteAsync(string symbol, DateOnly date, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new DailyQuoteResult(symbol.ToUpperInvariant(), date, "USD", 100m));
    }

    public Task<FundamentalResult> GetFundamentalsAsync(string symbol, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new FundamentalResult(symbol.ToUpperInvariant(), DateOnly.FromDateTime(DateTime.UtcNow), 1_000_000m, 20m));
    }
}
