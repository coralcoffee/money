using System.Collections.Generic;
using System.Linq;
using Volo.Abp;

namespace Money.Positions;

public sealed class FifoMatcher
{
    public MatchResult MatchSell(List<PositionLot> openLots, decimal sellQty, decimal sellPriceCad, decimal feeCad)
    {
        Check.NotNull(openLots, nameof(openLots));
        Check.Range(sellQty, nameof(sellQty), 0.000001m, decimal.MaxValue);
        Check.Range(sellPriceCad, nameof(sellPriceCad), 0.000001m, decimal.MaxValue);
        Check.Range(feeCad, nameof(feeCad), 0, decimal.MaxValue);

        var totalOpenQuantity = openLots.Sum(x => x.RemainingQuantity);
        if (totalOpenQuantity < sellQty)
        {
            throw new BusinessException("FifoMatcher.InsufficientQuantity");
        }

        var remaining = sellQty;
        var allocations = new List<LotAllocation>();

        foreach (var lot in openLots.OrderBy(x => x.OpenedAt))
        {
            if (remaining == 0)
            {
                break;
            }

            if (lot.RemainingQuantity <= 0)
            {
                continue;
            }

            var matchedQty = lot.RemainingQuantity >= remaining ? remaining : lot.RemainingQuantity;
            lot.Consume(matchedQty);
            remaining -= matchedQty;

            allocations.Add(new LotAllocation(lot.ActivityId, matchedQty, lot.UnitCostCad));
        }

        var proceeds = sellQty * sellPriceCad;
        var matchedCost = allocations.Sum(x => x.Quantity * x.UnitCostCad);
        var realizedPnlCad = proceeds - matchedCost - feeCad;

        return new MatchResult(sellQty, proceeds, matchedCost, feeCad, realizedPnlCad, allocations);
    }
}

public sealed record LotAllocation(
    System.Guid ActivityId,
    decimal Quantity,
    decimal UnitCostCad);

public sealed record MatchResult(
    decimal SellQuantity,
    decimal ProceedsCad,
    decimal MatchedCostCad,
    decimal FeeCad,
    decimal RealizedPnlCad,
    IReadOnlyList<LotAllocation> Allocations);
