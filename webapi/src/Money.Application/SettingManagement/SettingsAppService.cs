
namespace Money.SettingManagement;

public class SettingsAppService : ISettingsAppService
{
    public Task<SettingsDto> GetAsync()
    {
        return Task.FromResult(new SettingsDto
        {
            Theme = "light",
            Font = "font-sans", 
            BaseCurrency = "CAD",
            OnboardingCompleted = false,
            AutoUpdateCheckEnabled = true,
            MenuBarVisible = true
        });
    }

    public Task UpdateAsync(SettingsDto input)
    {
        // TODO: Implement actual update logic with persistence
        return Task.CompletedTask;
    }
}
