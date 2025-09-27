using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Money;
using Money.Application.SettingManagement;
using Money.EntityFrameworkCore;
using Money.Extensions;
using Money.Endpoints;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

builder.Services.ConfigureServices(builder.Configuration, builder.Environment);
var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MoneyDbContext>();
    await db.Database.EnsureCreatedAsync();

    await db.Database.ExecuteSqlRawAsync("PRAGMA journal_mode=WAL;");
    await db.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys=ON;");
}

// Configure Swagger middleware first
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Money API v1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Add redirect for the openapi endpoint that Swagger UI might be looking for
if (app.Environment.IsDevelopment())
{
    app.MapGet("/openapi/v1.json", async (HttpContext context) =>
    {
        context.Response.Redirect("/swagger/v1/swagger.json");
    })
    .ExcludeFromDescription();
}

// Map endpoints
app.MapGet("/hello", () => "Hello AOT!")
    .WithName("GetHello")
    .WithSummary("Test endpoint")
    .WithDescription("Simple test endpoint that returns a greeting");

// Map API endpoints
app.MapEndpoints();

app.Run();

namespace Money
{
    [JsonSourceGenerationOptions(WriteIndented = false)]
    [JsonSerializable(typeof(FinancialSettingsDto[]))]
    [JsonSerializable(typeof(WeatherForecast))]
    [JsonSerializable(typeof(IEnumerable<WeatherForecast>))]
    [JsonSerializable(typeof(string))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {

    }
}
