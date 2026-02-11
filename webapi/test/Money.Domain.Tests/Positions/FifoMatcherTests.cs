using System;
using System.Collections.Generic;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Money.Positions;

public class FifoMatcherTests
{
    [Fact]
    public void Should_Close_Sell_Against_Oldest_Open_Lots_First()
    {
        var lot1Id = Guid.NewGuid();
        var lot2Id = Guid.NewGuid();

        var lots = new List<PositionLot>
        {
            new(lot1Id, new DateTime(2026, 1, 1), 10m, 100m),
            new(lot2Id, new DateTime(2026, 1, 2), 10m, 120m)
        };

        var matcher = new FifoMatcher();
        var result = matcher.MatchSell(lots, 12m, 150m, 5m);

        result.Allocations.Count.ShouldBe(2);
        result.Allocations[0].ActivityId.ShouldBe(lot1Id);
        result.Allocations[0].Quantity.ShouldBe(10m);
        result.Allocations[1].ActivityId.ShouldBe(lot2Id);
        result.Allocations[1].Quantity.ShouldBe(2m);
        result.RealizedPnlCad.ShouldBe(555m);
    }

    [Fact]
    public void Should_Throw_When_Sell_Exceeds_Open_Quantity()
    {
        var lots = new List<PositionLot>
        {
            new(Guid.NewGuid(), new DateTime(2026, 1, 1), 2m, 100m)
        };

        var matcher = new FifoMatcher();

        Should.Throw<BusinessException>(() => matcher.MatchSell(lots, 3m, 120m, 0m));
    }
}
