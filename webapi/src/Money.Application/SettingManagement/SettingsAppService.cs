namespace Money.SettingManagement;

public class SettingsAppService(ISettingRepository settingRepository) : ISettingsAppService
{
    public async Task<SettingsDto> GetAsync()
    {
        var settings = await settingRepository.GetListAsync(null, null);
        var result = new SettingsDto();
        result.Theme = settings.Where(x => x.Name == "Theme").Select(x => x.Value).FirstOrDefault() ?? "light";
        result.Font = settings.Where(x => x.Name == "Font").Select(x => x.Value).FirstOrDefault() ?? "font-sans";
        result.BaseCurrency = settings.Where(x => x.Name == SettingNames.BaseCurrency).Select(x => x.Value).FirstOrDefault() ?? "CAD";
        result.OnboardingCompleted = settings.Where(x => x.Name == "OnboardingCompleted").Select(x => x.Value).FirstOrDefault() == "true";
        result.MenuBarVisible = settings.Where(x => x.Name == "MenuBarVisible").Select(x => x.Value).FirstOrDefault() == "true";

        return result;
    }

    public Task UpdateAsync(SettingsDto input)
    {
        // TODO: Implement actual update logic with persistence
        return Task.CompletedTask;
    }

    public async Task UpdateBaseCurrencyAsync(string baseCurrency)
    {
        var setting = await settingRepository.FindAsync(SettingNames.BaseCurrency);
        if (setting == null)
        {
            setting = new Setting(Guid.NewGuid(), SettingNames.BaseCurrency, baseCurrency);
            await settingRepository.InsertAsync(setting, true);
        }
        else
        {
            setting.Value = baseCurrency;
            await settingRepository.UpdateAsync(setting, true);
        }
    }
}
