using Microsoft.Extensions.Localization;
using Money.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Money;

[Dependency(ReplaceServices = true)]
public class MoneyBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<MoneyResource> _localizer;

    public MoneyBrandingProvider(IStringLocalizer<MoneyResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
