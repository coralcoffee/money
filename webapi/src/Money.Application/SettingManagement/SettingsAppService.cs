
namespace Money.SettingManagement;

public class SettingsAppService : ISettingsAppService
{
    public Task<SettingsDto> GetAsync()
    {
        return Task.FromResult(new SettingsDto
        {
            BaseCurrency = "CAD"
        });
    }

    public Task UpdateAsync(SettingsDto input)
    {
        throw new NotImplementedException();
    }
}
