using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Money.Endpoints;
using Money.EntityFrameworkCore;
using Money.SettingManagement;
using System.Reflection;

namespace Money;

public static class MoneyHttpApiHostModuleStartup
{
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        var contentRoot = environment.ContentRootPath;

        MoneyInfrastructureModuleStartup.ConfigureServices(services, configuration, contentRoot);
        MoneyApplicationModuleStartup.ConfigureServices(services);

        ConfigureCors(services, configuration);
        ConfigureSwaggerServices(services, configuration);
    }

    private static void ConfigureCors(IServiceCollection services, IConfiguration configuration)
    {
        // Add CORS services
        services.AddCors(options =>
         {
             options.AddPolicy("DevCorsPolicy", policy =>
             {
                 policy.WithOrigins("http://localhost:3000")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
             });
         });
    }

    private static void ConfigureSwaggerServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Money API", Version = "v1" });
            c.SwaggerDoc("v2", new OpenApiInfo { Title = "Money API", Version = "v2" });
        });
    }

    public static async Task InitializeApplicationAsync(this WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<MoneyDbContext>();
        await db.Database.EnsureCreatedAsync();

        await db.Database.ExecuteSqlRawAsync("PRAGMA journal_mode=WAL;");
        await db.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys=ON;");
    }

    public static void OnApplicationInitialization(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(ui =>
            {
                ui.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                ui.SwaggerEndpoint("/swagger/v2/swagger.json", "v2");
                ui.RoutePrefix = "docs";
            });
        }

        app.UseCors("AllowFrontend");
        app.MapEndpoints();
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
        var api = app.MapGroup("/api").WithOpenApi();

        var v1 = api.MapGroup("/v1").WithTags("v1");

        var settingsEndpoints = v1.MapGroup("/settings")
                              .WithTags("Settings")
                              .WithGroupName("v1");

        settingsEndpoints.MapGet("/", async (ISettingsAppService appService) => TypedResults.Ok(await appService.GetAsync()))
                         .WithName("GetSettings")
                         .WithSummary("Get application settings")
                         .Produces<SettingsDto>(StatusCodes.Status200OK)
                         .WithOpenApi();

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
