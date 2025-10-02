namespace Money.SettingManagement;

public interface ISettingsAppService
{
    Task<SettingsDto> GetAsync();

    Task UpdateAsync(SettingsDto input);

    Task UpdateBaseCurrencyAsync(string baseCurrency);
}
