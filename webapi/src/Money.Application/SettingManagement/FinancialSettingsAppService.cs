
namespace Money.SettingManagement;

public class FinancialSettingsAppService : IFinancialSettingsAppService
{
    public Task<FinancialSettingsDto> GetAsync()
    {
        return Task.FromResult(new FinancialSettingsDto
        {
            Currency = "CAD"
        });
    }

    public Task UpdateAsync(FinancialSettingsDto input)
    {
        throw new NotImplementedException();
    }
}
