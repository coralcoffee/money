namespace Money.SettingManagement;

public static class SettingConsts
{
    public static int MaxNameLength { get; set; } = 128;

    public static int MaxValueLength { get; set; } = 2048;

    public static int MaxValueLengthValue { get; set; } = MaxValueLength;

    public static int MaxProviderNameLength { get; set; } = 64;

    public static int MaxProviderKeyLength { get; set; } = 64;
}
