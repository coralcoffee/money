using System;
using System.Threading;
using System.Threading.Tasks;

namespace Money.MarketData;

public interface IMarketDataClient
{
    Task<DailyQuoteResult> GetDailyQuoteAsync(string symbol, DateOnly date, CancellationToken cancellationToken = default);

    Task<FundamentalResult> GetFundamentalsAsync(string symbol, CancellationToken cancellationToken = default);
}

public sealed record DailyQuoteResult(string Symbol, DateOnly Date, string Currency, decimal Close);

public sealed record FundamentalResult(string Symbol, DateOnly Date, decimal? MarketCap, decimal? TrailingPe);
