using Volo.Abp.Modularity;

namespace Money;

[DependsOn(
    typeof(MoneyDomainModule),
    typeof(MoneyTestBaseModule)
)]
public class MoneyDomainTestModule : AbpModule
{

}
