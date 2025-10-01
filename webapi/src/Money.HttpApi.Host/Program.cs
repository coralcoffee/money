using Money;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
#if DEBUG
    .MinimumLevel.Debug()
#else
            .MinimumLevel.Information()
#endif
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Async(c => c.File("Logs/logs.txt"))
    .WriteTo.Async(c => c.Console())
    .CreateLogger();
try
{
    var builder = WebApplication.CreateBuilder(args);
    MoneyHttpApiHostModuleStartup.ConfigureServices(builder.Services, builder.Configuration, builder.Environment);

    var app = builder.Build();
    await app.InitializeApplicationAsync();
    app.OnApplicationInitialization();
    await app.RunAsync();
    return 0;
}
catch (Exception ex)
{
    if (ex is HostAbortedException)
    {
        throw;
    }
    Log.Fatal(ex, "Host terminated unexpectedly!");
    return 1;
}
finally
{
    Log.CloseAndFlush();
}


record Todo(int Id, string Title, bool IsDone);
record CreateTodo(string Title);
record TodoV2(int Id, string Title, bool IsDone, DateTimeOffset UpdatedUtc);
