using Money;

var builder = WebApplication.CreateBuilder(args);
MoneyHttpApiHostModuleStartup.ConfigureServices(builder.Services, builder.Configuration, builder.Environment);

var app = builder.Build();

await app.InitialApplication();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(ui =>
    {
        ui.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        ui.SwaggerEndpoint("/swagger/v2/swagger.json", "v2");
        ui.RoutePrefix = "docs"; // /docs
    });
}
// Use CORS
app.UseCors("AllowFrontend");
var api = app.MapGroup("/api")
             .WithOpenApi(); // base group contributes to OpenAPI

// v1 (public)
var v1 = api.MapGroup("/v1")
            .WithTags("v1");

// Feature group: todos (v1)
var todosV1 = v1.MapGroup("/todos")
                .WithTags("Todos")
                .WithGroupName("v1"); // <¡ª tells Swashbuckle to place these operations under Swagger doc "v1"

// Fake data
var todos = new List<Todo> { new(1, "Try MapGroup", false) };

todosV1.MapGet("/", () => TypedResults.Ok(todos))
       .WithName("GetTodosV1")
       .WithSummary("List todos (v1)")
       .Produces<List<Todo>>(StatusCodes.Status200OK)
       .WithOpenApi();

todosV1.MapPost("/", (CreateTodo dto) =>
{
    var nextId = (todos.Count == 0 ? 1 : todos.Max(t => t.Id) + 1);
    var todo = new Todo(nextId, dto.Title, false);
    todos.Add(todo);
    return TypedResults.Created($"/api/v1/todos/{todo.Id}", todo);
})
.WithName("CreateTodoV1")
.WithSummary("Create todo (v1)")
.Accepts<CreateTodo>("application/json")
.Produces<Todo>(StatusCodes.Status201Created)
.WithOpenApi();

// v2 (admin-gated, different shape/behavior)
var v2 = api.MapGroup("/v2")
            .WithTags("v2"); // apply policy to the whole version

var todosV2 = v2.MapGroup("/todos")
                .WithTags("Todos")
                .WithGroupName("v2");

// Example: v2 GET adds filtering and returns a richer DTO
todosV2.MapGet("/", (bool? done) =>
{
    IEnumerable<Todo> result = todos;
    if (done is not null) result = result.Where(t => t.IsDone == done);
    var payload = result.Select(t => new TodoV2(t.Id, t.Title, t.IsDone, UpdatedUtc: DateTimeOffset.UtcNow));
    return TypedResults.Ok(payload);
})
.WithName("GetTodosV2")
.WithSummary("List todos (v2, filterable)")
.Produces<IEnumerable<TodoV2>>(StatusCodes.Status200OK)
.WithOpenApi();

// Example: per-group endpoint filters (validation, logging, etc.)
//todosV2.AddEndpointFilter(new ValidateTitleFilter());
app.MapEndpoints();

app.Run();

record Todo(int Id, string Title, bool IsDone);
record CreateTodo(string Title);
record TodoV2(int Id, string Title, bool IsDone, DateTimeOffset UpdatedUtc);

// Simple endpoint filter demo
class ValidateTitleFilter : IEndpointFilter
{
    public ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext ctx, EndpointFilterDelegate next)
    {
        var dto = ctx.Arguments.OfType<CreateTodo>().FirstOrDefault();
        if (dto is not null && string.IsNullOrWhiteSpace(dto.Title))
        {
            return ValueTask.FromResult<object?>(TypedResults.ValidationProblem(new Dictionary<string, string[]>
            {
                ["title"] = new[] { "Title is required." }
            }));
        }
        return next(ctx);
    }
}