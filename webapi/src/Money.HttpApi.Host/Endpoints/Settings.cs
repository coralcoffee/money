using Microsoft.AspNetCore.Http.HttpResults;
using Money.SettingManagement;

namespace Money.Endpoints;

public class Settings : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetAsync);
    }

    public async Task<Ok<SettingsDto>> GetAsync(ISettingsAppService appService)
    {
        return TypedResults.Ok(await appService.GetAsync());
    }
}
