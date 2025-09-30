using Microsoft.Extensions.DependencyInjection;
using Money.EntityFrameworkCore;
using Money.SettingManagement;

namespace Money;

public static class MoneyInfrastructureModuleStartup
{
    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient(typeof(IDbContextProvider<>), typeof(DefaultDbContextProvider<>));
        services.AddTransient<ISettingRepository, SettingRepository>();
    }
}
