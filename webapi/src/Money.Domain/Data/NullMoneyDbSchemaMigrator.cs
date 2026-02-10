using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Money.Data;

/* This is used if database provider does't define
 * IMoneyDbSchemaMigrator implementation.
 */
public class NullMoneyDbSchemaMigrator : IMoneyDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
