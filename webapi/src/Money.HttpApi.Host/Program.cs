using Microsoft.EntityFrameworkCore;
using Money.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});
// Build absolute path: <contentRoot>/App_Data/app.db
var contentRoot = builder.Environment.ContentRootPath;
var dataDir = Path.Combine(contentRoot, "App_Data");
Directory.CreateDirectory(dataDir);
var dbPath = Path.Combine(dataDir, "app.db");

// You can still keep the format token in appsettings.json; replace here:
var raw = builder.Configuration.GetConnectionString("Default")!;
var connStr = raw.Replace("{ContentRoot}", contentRoot);

// Or build with SqliteConnectionStringBuilder (equivalent):
// var csb = new SqliteConnectionStringBuilder { DataSource = dbPath, Cache = SqliteCacheMode.Shared, Pooling = true, Mode = SqliteOpenMode.ReadWriteCreate };
// var connStr = csb.ToString();

//builder.Services.AddDbContext<MoneyDbContext>(opt =>
//{
//    opt.UseSqlite(connStr);
//    // For AOT/trimming safety, keep provider calls in code (no reflection-based loading)
//});
builder.Services.AddDbContext<MoneyDbContext>(opt =>
    opt.UseSqlite(connStr, x => x.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery))
        .UseModel(Money.CompiledModels.MoneyDbContextModel.Instance));

var app = builder.Build();
// Apply basic startup setup (PRAGMAs) once per process
await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MoneyDbContext>();
    await db.Database.EnsureCreatedAsync();

    // Enable WAL (better write concurrency) and foreign keys
    await db.Database.ExecuteSqlRawAsync("PRAGMA journal_mode=WAL;");
    await db.Database.ExecuteSqlRawAsync("PRAGMA foreign_keys=ON;");
}

var sampleTodos = new Todo[] {
    new(1, "Walk the dog"),
    new(2, "Do the dishes", DateOnly.FromDateTime(DateTime.Now)),
    new(3, "Do the laundry", DateOnly.FromDateTime(DateTime.Now.AddDays(1))),
    new(4, "Clean the bathroom"),
    new(5, "Clean the car", DateOnly.FromDateTime(DateTime.Now.AddDays(2)))
};

var todosApi = app.MapGroup("/todos");
todosApi.MapGet("/", () => sampleTodos);
todosApi.MapGet("/{id}", (int id) =>
    sampleTodos.FirstOrDefault(a => a.Id == id) is { } todo
        ? Results.Ok(todo)
        : Results.NotFound());
app.MapGet("/users/{userId}/books/{bookId}",
    (int userId, int bookId) => $"The user id is {userId} and book id is {bookId}");
app.Run();

public record Todo(int Id, string? Title, DateOnly? DueBy = null, bool IsComplete = false);

[JsonSerializable(typeof(Todo[]))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{

}
