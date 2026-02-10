using Volo.Abp.Modularity;

namespace Money;

public abstract class MoneyApplicationTestBase<TStartupModule> : MoneyTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
