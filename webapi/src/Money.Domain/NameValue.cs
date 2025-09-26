using System;

namespace Money;

[Serializable]
public class NameValue : NameValue<string>
{
    public NameValue()
    {

    }

    public NameValue(string name, string value)
    {
        Name = name;
        Value = value;
    }
}

[Serializable]
public class NameValue<T>
{
    public string Name { get; set; } = default!;

    public T Value { get; set; } = default!;

    public NameValue()
    {

    }

    public NameValue(string name, T value)
    {
        Name = name;
        Value = value;
    }
}
