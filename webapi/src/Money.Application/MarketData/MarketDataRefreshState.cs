using System;

namespace Money.MarketData;

public class MarketDataRefreshState
{
    public DateTime? LastRefreshStartedAtUtc { get; private set; }

    public DateTime? LastRefreshCompletedAtUtc { get; private set; }

    public bool LastRefreshSucceeded { get; private set; }

    public int LastRefreshSymbolCount { get; private set; }

    public string? LastError { get; private set; }

    public void MarkStarted()
    {
        LastRefreshStartedAtUtc = DateTime.UtcNow;
        LastError = null;
    }

    public void MarkCompleted(int symbolCount)
    {
        LastRefreshCompletedAtUtc = DateTime.UtcNow;
        LastRefreshSucceeded = true;
        LastRefreshSymbolCount = symbolCount;
        LastError = null;
    }

    public void MarkFailed(Exception exception)
    {
        LastRefreshCompletedAtUtc = DateTime.UtcNow;
        LastRefreshSucceeded = false;
        LastError = exception.Message;
    }
}
