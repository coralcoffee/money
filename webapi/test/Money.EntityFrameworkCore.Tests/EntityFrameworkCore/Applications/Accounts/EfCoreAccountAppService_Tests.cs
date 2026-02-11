using Money.Accounts;
using Xunit;

namespace Money.EntityFrameworkCore.Applications.Accounts;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreAccountAppService_Tests : AccountAppService_Tests<MoneyEntityFrameworkCoreTestModule>
{
}
