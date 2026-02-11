using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;
using Money.Accounts;
using Money.Activities;

namespace Money;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class MoneyAccountToAccountDtoMapper : MapperBase<Account, AccountDto>
{
    public override partial AccountDto Map(Account source);

    public override partial void Map(Account source, AccountDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class MoneyActivityToActivityDtoMapper : MapperBase<Activity, ActivityDto>
{
    public override partial ActivityDto Map(Activity source);

    public override partial void Map(Activity source, ActivityDto destination);
}
