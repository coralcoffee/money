using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Money.MarketData;

public class DailyMarketPrice : AuditedAggregateRoot<Guid>
{
    public string Symbol { get; private set; }

    public DateOnly Date { get; private set; }

    public string Currency { get; private set; }

    public decimal Close { get; private set; }

    protected DailyMarketPrice()
    {
        Symbol = string.Empty;
        Currency = string.Empty;
    }

    public DailyMarketPrice(Guid id, string symbol, DateOnly date, string currency, decimal close)
        : base(id)
    {
        Symbol = symbol;
        Date = date;
        Currency = currency;
        Close = close;
    }
}
