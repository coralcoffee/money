using Money.MarketData;
using Xunit;

namespace Money.EntityFrameworkCore.Applications.MarketData;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreMarketDataRefreshJobTests : MarketDataRefreshJobTests<MoneyEntityFrameworkCoreTestModule>
{
}
