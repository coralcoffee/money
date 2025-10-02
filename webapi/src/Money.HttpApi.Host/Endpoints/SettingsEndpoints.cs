using Microsoft.AspNetCore.Http.HttpResults;
using Money.SettingManagement;

namespace Money.Endpoints;

public class SettingsEndpoints : EndpointGroupBase
{
    public override string GroupName => "Settings";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetAsync);
        groupBuilder.MapPut(UpdateBaseCurrencyAsync, "base-currency/{baseCurrency}"); 
    }

    public async Task<Ok<SettingsDto>> GetAsync(ISettingsAppService appService)
    {
        return TypedResults.Ok(await appService.GetAsync());
    }

    public async Task<IResult> UpdateBaseCurrencyAsync(ISettingsAppService appService, string baseCurrency)
    {
        await appService.UpdateBaseCurrencyAsync(baseCurrency);
        return TypedResults.Ok();
    }
}
