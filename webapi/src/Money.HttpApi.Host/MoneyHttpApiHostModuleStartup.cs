using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Money.Endpoints;
using Money.EntityFrameworkCore;

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

    private static WebApplication MapEndpoints(this WebApplication app)
    {
        var api = app
            .MapGroup("/api")
            .MapGroup("/v1")
            .WithOpenApi();

        var endPointsFactories = new Dictionary<Type, Func<EndpointGroupBase>>
        {
            { typeof(SettingsEndpoints), () => new SettingsEndpoints()},
        };

        foreach (var factory in endPointsFactories)
        {
            var instance = factory.Value();
            if (instance != null)
                api.AddEndPoints(instance);
        }

        return app;
    }

    private static void AddEndPoints(this RouteGroupBuilder routeGroupBuilder, EndpointGroupBase endpointGroup, string version = "v1")
    {
        var groupName = endpointGroup.GroupName;

        var routeGroup = routeGroupBuilder
            .MapGroup($"/{groupName.ToLower()}")
            .WithGroupName(version)
            .WithTags(groupName);

        endpointGroup.Map(routeGroup);
    }
}
