namespace Money.SettingManagement;

public interface IFinancialSettingsAppService
{
    Task<FinancialSettingsDto> GetAsync();

    Task UpdateAsync(FinancialSettingsDto input);
}
