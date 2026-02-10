using System.Threading.Tasks;

namespace Money.Data;

public interface IMoneyDbSchemaMigrator
{
    Task MigrateAsync();
}
