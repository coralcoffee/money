using Money.Activities;
using Xunit;

namespace Money.EntityFrameworkCore.Applications.Activities;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreActivityAppServiceTests : ActivityAppServiceTests<MoneyEntityFrameworkCoreTestModule>
{
}
