using System;
using System.Collections.Generic;
using Money.Positions;
using Shouldly;
using Xunit;

namespace Money.Analytics;

public class PnlCalculatorTests
{
    [Fact]
    public void Should_Calculate_Realized_Pnl_From_Fifo_Match()
    {
        var calculator = new PnlCalculator(new FifoMatcher());
        var lots = new List<PositionLot>
        {
            new(Guid.NewGuid(), new DateTime(2026, 1, 1), 5m, 100m),
            new(Guid.NewGuid(), new DateTime(2026, 1, 2), 5m, 110m)
        };

        var result = calculator.CalculateRealizedPnlFromSell(lots, 6m, 130m, 2m);

        result.MatchedCostCad.ShouldBe(610m);
        result.ProceedsCad.ShouldBe(780m);
        result.RealizedPnlCad.ShouldBe(168m);
    }
}
