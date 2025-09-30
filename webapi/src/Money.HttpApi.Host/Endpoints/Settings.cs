using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.HttpResults;
using Money.SettingManagement;

namespace Money.Endpoints;

public class Settings : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetAsync);
        groupBuilder.MapPut(UpdateAsync); 
    }

    public async Task<Ok<SettingsDto>> GetAsync(ISettingsAppService appService)
    {
        return TypedResults.Ok(await appService.GetAsync());
    }

    public async Task<Ok<SettingsDto>> UpdateAsync(ISettingsAppService appService, SettingsDto dto)
    {
        await appService.UpdateAsync(dto);
        return TypedResults.Ok(dto);
    }
}
