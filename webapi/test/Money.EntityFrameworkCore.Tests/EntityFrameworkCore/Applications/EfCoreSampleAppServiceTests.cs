using Money.Samples;
using Xunit;

namespace Money.EntityFrameworkCore.Applications;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<MoneyEntityFrameworkCoreTestModule>
{

}
