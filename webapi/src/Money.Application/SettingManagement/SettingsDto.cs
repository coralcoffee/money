namespace Money.SettingManagement;

public class SettingsDto
{
    public string Theme { get; set; } = "light";
    public string Font { get; set; } = "font-sans";
    public string BaseCurrency { get; set; } = "CAD";
    public bool OnboardingCompleted { get; set; } = false;
    public bool AutoUpdateCheckEnabled { get; set; } = true;
    public bool MenuBarVisible { get; set; } = true;
}
