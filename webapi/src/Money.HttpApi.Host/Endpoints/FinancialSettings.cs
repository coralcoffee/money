using Microsoft.AspNetCore.Http.HttpResults;
using Money.SettingManagement;

namespace Money.Endpoints;

public class FinancialSettings : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetAsync);
    }

    public async Task<Ok<FinancialSettingsDto>> GetAsync(IFinancialSettingsAppService appService)
    {
        return TypedResults.Ok(await appService.GetAsync());
    }
}
