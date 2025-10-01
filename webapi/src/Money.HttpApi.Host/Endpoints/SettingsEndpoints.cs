using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.HttpResults;
using Money.SettingManagement;

namespace Money.Endpoints;

public class SettingsEndpoints : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        var settingsEndpoints = groupBuilder.MapGroup("/settings")
                              .WithTags("Settings")
                              .WithGroupName("v1");

        settingsEndpoints.MapGet("/", async (ISettingsAppService appService) => TypedResults.Ok(await appService.GetAsync()))
                         .WithName("GetSettings")
                         .WithSummary("Get application settings")
                         .Produces<SettingsDto>(StatusCodes.Status200OK)
                         .WithOpenApi();
        groupBuilder.MapGet(GetAsync);
        groupBuilder.MapPut(UpdateAsync, "base-currency/{baseCurrency}"); 
    }

    public async Task<Ok<SettingsDto>> GetAsync(ISettingsAppService appService)
    {
        return TypedResults.Ok(await appService.GetAsync());
    }

    public async Task<Ok<SettingsDto>> UpdateAsync(ISettingsAppService appService, string baseCurrency)
    {
        var dto = new SettingsDto();
        dto.BaseCurrency = baseCurrency;
        await appService.UpdateAsync(dto);
        return TypedResults.Ok(dto);
    }
}
