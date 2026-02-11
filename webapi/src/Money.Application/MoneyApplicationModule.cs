using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.Account;
using Volo.Abp.Identity;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Modularity;
using Microsoft.Extensions.DependencyInjection;
using Money.Analytics;
using Money.MarketData;
using Money.Positions;
using Volo.Abp.TenantManagement;

namespace Money;

[DependsOn(
    typeof(MoneyDomainModule),
    typeof(MoneyApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule)
    )]
public class MoneyApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddTransient<FifoMatcher>();
        context.Services.AddTransient<PnlCalculator>();
        context.Services.AddSingleton<MarketDataRefreshState>();
        context.Services.AddTransient<MarketDataRefreshJob>();
        context.Services.AddTransient<IMarketDataClient, YahooFinanceClient>();
    }
}
