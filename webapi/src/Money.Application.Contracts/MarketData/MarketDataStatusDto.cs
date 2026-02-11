using System;

namespace Money.MarketData;

public class MarketDataStatusDto
{
    public DateTime? LastRefreshStartedAtUtc { get; set; }

    public DateTime? LastRefreshCompletedAtUtc { get; set; }

    public bool LastRefreshSucceeded { get; set; }

    public int LastRefreshSymbolCount { get; set; }

    public string? LastError { get; set; }
}
