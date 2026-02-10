using Money.Books;
using Xunit;

namespace Money.EntityFrameworkCore.Applications.Books;

[Collection(MoneyTestConsts.CollectionDefinitionName)]
public class EfCoreBookAppService_Tests : BookAppService_Tests<MoneyEntityFrameworkCoreTestModule>
{

}