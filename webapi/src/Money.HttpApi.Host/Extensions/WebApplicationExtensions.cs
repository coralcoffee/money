using System.Reflection;
using Money.Endpoints;

namespace Money.Extensions;

public static class WebApplicationExtensions
{
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
        // Direct instantiation instead of reflection
        var weatherForecasts = new WeatherForecasts();
        weatherForecasts.Map(app.MapGroup(weatherForecasts));
        

        return app;
    }
}
