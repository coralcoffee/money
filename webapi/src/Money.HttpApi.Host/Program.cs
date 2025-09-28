using Money;

var builder = WebApplication.CreateBuilder(args);
builder.Services.ConfigureServices(builder.Configuration, builder.Environment);

var app = builder.Build();

await app.InitialApplication();

app.MapGet("/", () => "Hello World!");
app.MapEndpoints();

app.Run();
