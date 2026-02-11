using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Money.MarketData;

public class InstrumentFundamentalSnapshot : AuditedAggregateRoot<Guid>
{
    public string Symbol { get; private set; }

    public DateOnly Date { get; private set; }

    public decimal? MarketCap { get; private set; }

    public decimal? TrailingPe { get; private set; }

    protected InstrumentFundamentalSnapshot()
    {
        Symbol = string.Empty;
    }

    public InstrumentFundamentalSnapshot(Guid id, string symbol, DateOnly date, decimal? marketCap, decimal? trailingPe)
        : base(id)
    {
        Symbol = symbol;
        Date = date;
        MarketCap = marketCap;
        TrailingPe = trailingPe;
    }
}
