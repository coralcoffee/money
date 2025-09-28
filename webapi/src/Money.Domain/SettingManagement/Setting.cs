using JetBrains.Annotations;

namespace Money.SettingManagement;

public sealed class Setting 
{
    public Guid Id { get; private set; }

    [NotNull]
    public string Name { get; private set; } = null!;

    [NotNull]
    public string Value { get; private set; } = null!;

    [CanBeNull]
    public string? ProviderName { get; private set; }

    [CanBeNull]
    public string? ProviderKey { get; private set; }

    private Setting()
    {

    }

    public Setting(
        Guid id,
        [NotNull] string name,
        [NotNull] string value,
        [CanBeNull] string? providerName = null,
        [CanBeNull] string? providerKey = null)
    {
        Check.NotNull(name, nameof(name));
        Check.NotNull(value, nameof(value));

        Id = id;
        Name = name;
        Value = value;
        ProviderName = providerName;
        ProviderKey = providerKey;
    }

    public override string ToString()
    {
        return $"{base.ToString()}, Name = {Name}, Value = {Value}, ProviderName = {ProviderName}, ProviderKey = {ProviderKey}";
    }
}
