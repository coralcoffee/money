using Money.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace Money.Permissions;

public class MoneyPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(MoneyPermissions.GroupName);

        var accountsPermission = myGroup.AddPermission(MoneyPermissions.Accounts.Default, L("Permission:Accounts"));
        accountsPermission.AddChild(MoneyPermissions.Accounts.Create, L("Permission:Accounts.Create"));
        accountsPermission.AddChild(MoneyPermissions.Accounts.Edit, L("Permission:Accounts.Edit"));
        accountsPermission.AddChild(MoneyPermissions.Accounts.Delete, L("Permission:Accounts.Delete"));

        var activitiesPermission = myGroup.AddPermission(MoneyPermissions.Activities.Default, L("Permission:Activities"));
        activitiesPermission.AddChild(MoneyPermissions.Activities.Create, L("Permission:Activities.Create"));
        activitiesPermission.AddChild(MoneyPermissions.Activities.Edit, L("Permission:Activities.Edit"));
        activitiesPermission.AddChild(MoneyPermissions.Activities.Delete, L("Permission:Activities.Delete"));
        //Define your own permissions here. Example:
        //myGroup.AddPermission(MoneyPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<MoneyResource>(name);
    }
}
