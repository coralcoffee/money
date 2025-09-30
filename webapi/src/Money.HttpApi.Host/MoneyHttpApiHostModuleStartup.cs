using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Money.Endpoints;
using Money.EntityFrameworkCore;
using System.Reflection;
using Money.SettingManagement;

namespace Money;

public static class MoneyHttpApiHostModuleStartup
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        var contentRoot = environment.ContentRootPath;

        AddDatabase(services, configuration, contentRoot);
        MoneyInfrastructureModuleStartup.ConfigureServices(services);
        // Add CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                builder => builder
                    .WithOrigins("http://localhost:3000", "http://localhost:3001", "https://localhost:3000", "https://localhost:3001")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });

        services.AddTransient<ISettingsAppService, SettingsAppService>();
        return services;
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

    public static async Task InitialApplication(this WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<MoneyDbContext>();
        await db.Database.EnsureCreatedAsync();

        await db.Database.ExecuteSqlRawAsync("PRAGMA journal_mode=WAL;");
        await db.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys=ON;");
    }

    private static RouteGroupBuilder MapGroup(this WebApplication app, EndpointGroupBase group)
    {
        var groupName = group.GroupName ?? group.GetType().Name;

        return app
            .MapGroup($"/api/{groupName}")
            .WithGroupName(groupName)
            .WithTags(groupName);
    }

    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var endpointGroupType = typeof(EndpointGroupBase);

        var assembly = Assembly.GetExecutingAssembly();

        var endpointGroupTypes = assembly.GetExportedTypes()
            .Where(t => t.IsSubclassOf(endpointGroupType));

        foreach (var type in endpointGroupTypes)
        {
            if (Activator.CreateInstance(type) is EndpointGroupBase instance)
            {
                instance.Map(app.MapGroup(instance));
            }
        }

        return app;
    }
}
