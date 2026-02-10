using Volo.Abp.Modularity;

namespace Money;

[DependsOn(
    typeof(MoneyApplicationModule),
    typeof(MoneyDomainTestModule)
)]
public class MoneyApplicationTestModule : AbpModule
{

}
