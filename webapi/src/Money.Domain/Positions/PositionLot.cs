using System;
using Volo.Abp;

namespace Money.Positions;

public class PositionLot
{
    public Guid ActivityId { get; }

    public DateTime OpenedAt { get; }

    public decimal RemainingQuantity { get; private set; }

    public decimal UnitCostCad { get; }

    public PositionLot(Guid activityId, DateTime openedAt, decimal remainingQuantity, decimal unitCostCad)
    {
        ActivityId = activityId;
        OpenedAt = openedAt;
        RemainingQuantity = Check.Range(remainingQuantity, nameof(remainingQuantity), 0.000001m, decimal.MaxValue);
        UnitCostCad = Check.Range(unitCostCad, nameof(unitCostCad), 0.000001m, decimal.MaxValue);
    }

    public void Consume(decimal quantity)
    {
        Check.Range(quantity, nameof(quantity), 0.000001m, decimal.MaxValue);
        if (quantity > RemainingQuantity)
        {
            throw new BusinessException("PositionLot.QuantityExceeded");
        }

        RemainingQuantity -= quantity;
    }
}
