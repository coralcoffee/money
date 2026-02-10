using Money.Samples;
using Xunit;

namespace Money.EntityFrameworkCore.Domains;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<MoneyEntityFrameworkCoreTestModule>
{

}
