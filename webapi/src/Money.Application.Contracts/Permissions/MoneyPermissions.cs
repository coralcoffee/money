namespace Money.Permissions;

public static class MoneyPermissions
{
    public const string GroupName = "Money";

    public static class Accounts
    {
        public const string Default = GroupName + ".Accounts";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    public static class Activities
    {
        public const string Default = GroupName + ".Activities";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }
    
    //Add your own permission names. Example:
    //public const string MyPermission1 = GroupName + ".MyPermission1";
}
