using Money;

var builder = WebApplication.CreateBuilder(args);
builder.Services.ConfigureServices(builder.Configuration, builder.Environment);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

await app.InitialApplication();

// Use CORS
app.UseCors("AllowFrontend");

app.MapGet("/", () => "Hello World!");
app.MapEndpoints();

app.Run();
