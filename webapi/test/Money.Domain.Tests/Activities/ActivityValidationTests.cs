using System;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Money.Activities;

public class ActivityValidationTests
{
    [Fact]
    public void Buy_Must_Require_Instrument_Quantity_And_Price()
    {
        Should.Throw<BusinessException>(() => new Activity(
            Guid.NewGuid(),
            Guid.NewGuid(),
            ActivityType.Buy,
            DateTime.UtcNow,
            "USD",
            1000m,
            null,
            null,
            0m,
            1.35m,
            null,
            null
        ));
    }

    [Fact]
    public void Deposit_Must_Not_Allow_Quantity()
    {
        Should.Throw<BusinessException>(() => new Activity(
            Guid.NewGuid(),
            Guid.NewGuid(),
            ActivityType.Deposit,
            DateTime.UtcNow,
            "CAD",
            500m,
            10m,
            null,
            null,
            1m,
            null,
            null
        ));
    }
}
