using Money.Localization;
using Volo.Abp.Application.Services;

namespace Money;

/* Inherit your application services from this class.
 */
public abstract class MoneyAppService : ApplicationService
{
    protected MoneyAppService()
    {
        LocalizationResource = typeof(MoneyResource);
    }
}
