using Money.Analytics;
using Xunit;

namespace Money.EntityFrameworkCore.Applications.Analytics;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreAnalyticsAppServiceTests : AnalyticsAppServiceTests<MoneyEntityFrameworkCoreTestModule>
{
}
