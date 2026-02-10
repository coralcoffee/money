using Money.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Money.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(MoneyEntityFrameworkCoreModule),
    typeof(MoneyApplicationContractsModule)
)]
public class MoneyDbMigratorModule : AbpModule
{
}
