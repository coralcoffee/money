using Microsoft.Extensions.DependencyInjection;
using Money.SettingManagement;

namespace Money;

public static class MoneyApplicationModuleStartup
{
    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<ISettingsAppService, SettingsAppService>();
    }
}
