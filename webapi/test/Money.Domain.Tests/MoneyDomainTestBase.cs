using Volo.Abp.Modularity;

namespace Money;

/* Inherit from this class for your domain layer tests. */
public abstract class MoneyDomainTestBase<TStartupModule> : MoneyTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
