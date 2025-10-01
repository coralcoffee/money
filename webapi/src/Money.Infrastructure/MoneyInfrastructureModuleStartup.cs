using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Money.EntityFrameworkCore;
using Money.SettingManagement;

namespace Money;

public static class MoneyInfrastructureModuleStartup
{
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration, string contentRoot)
    {
        AddDatabase(services, configuration, contentRoot);
        services.AddTransient(typeof(IDbContextProvider<>), typeof(DefaultDbContextProvider<>));
        services.AddTransient<ISettingRepository, SettingRepository>();
    }

    private static void AddDatabase(IServiceCollection services, IConfiguration configuration, string contentRoot)
    {
        var raw = configuration.GetConnectionString("Default")!;
        var connStr = raw.Replace("{ContentRoot}", contentRoot);

        var connectionStringBuilder = new SqliteConnectionStringBuilder(connStr);
        var dbPath = connectionStringBuilder.DataSource;
        var dbDirectory = Path.GetDirectoryName(dbPath);
        if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
        {
            Directory.CreateDirectory(dbDirectory);
        }

        services.AddDbContext<MoneyDbContext>(
            opt => opt.UseSqlite(connStr, x => x.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery))
        );
    }
}
