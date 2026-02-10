using Money.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Money.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class MoneyController : AbpControllerBase
{
    protected MoneyController()
    {
        LocalizationResource = typeof(MoneyResource);
    }
}
