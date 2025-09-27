using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Money.EntityFrameworkCore;

namespace Money;

public static class MoneyHttpApiHostModuleStartup
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        var contentRoot = environment.ContentRootPath;

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
                .UseModel(Money.CompiledModels.MoneyDbContextModel.Instance)
        );

        services.AddEndpointsApiExplorer();

        services.AddHealthChecks()
             .AddDbContextCheck<MoneyDbContext>();
        services.AddOpenApiDocument((configure, sp) =>
        {
            configure.Title = "Money Web API";

            // Add JWT
            //configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            //{
            //    Type = OpenApiSecuritySchemeType.ApiKey,
            //    Name = "Authorization",
            //    In = OpenApiSecurityApiKeyLocation.Header,
            //    Description = "Type into the textbox: Bearer {your JWT token}."
            //});

            //configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
        });

        return services;
    }
}
