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

app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSwaggerUi(settings =>
{
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.MapEndpoints();

app.Run();

namespace Money
{
    [JsonSourceGenerationOptions(WriteIndented = false)]
    [JsonSerializable(typeof(FinancialSettingsDto[]))]
    [JsonSerializable(typeof(WeatherForecast))]
    [JsonSerializable(typeof(IEnumerable<WeatherForecast>))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {

    }
}
