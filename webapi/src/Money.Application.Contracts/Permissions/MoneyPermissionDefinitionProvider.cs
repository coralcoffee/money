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

        var booksPermission = myGroup.AddPermission(MoneyPermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(MoneyPermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(MoneyPermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(MoneyPermissions.Books.Delete, L("Permission:Books.Delete"));
        //Define your own permissions here. Example:
        //myGroup.AddPermission(MoneyPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<MoneyResource>(name);
    }
}
