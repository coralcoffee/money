using Xunit;

namespace Money.EntityFrameworkCore;

[CollectionDefinition(MoneyTestConsts.CollectionDefinitionName)]
public class MoneyEntityFrameworkCoreCollection : ICollectionFixture<MoneyEntityFrameworkCoreFixture>
{

}
