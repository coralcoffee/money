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

    public async Task<Ok<SettingsDto>> UpdateBaseCurrencyAsync(ISettingsAppService appService, string baseCurrency)
    {
        var dto = new SettingsDto();
        dto.BaseCurrency = baseCurrency;
        await appService.UpdateAsync(dto);
        return TypedResults.Ok(dto);
    }
}
