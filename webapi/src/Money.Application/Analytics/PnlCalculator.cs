using System.Collections.Generic;
using Money.Positions;

namespace Money.Analytics;

public class PnlCalculator
{
    private readonly FifoMatcher _fifoMatcher;

    public PnlCalculator(FifoMatcher fifoMatcher)
    {
        _fifoMatcher = fifoMatcher;
    }

    public MatchResult CalculateRealizedPnlFromSell(
        List<PositionLot> openLots,
        decimal sellQty,
        decimal sellPriceCad,
        decimal feeCad)
    {
        return _fifoMatcher.MatchSell(openLots, sellQty, sellPriceCad, feeCad);
    }
}
