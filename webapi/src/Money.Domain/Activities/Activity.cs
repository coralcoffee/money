using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Money.Activities;

public class Activity : AuditedAggregateRoot<Guid>
{
    public Guid AccountId { get; private set; }

    public ActivityType Type { get; private set; }

    public DateTime TradeDate { get; private set; }

    public string Currency { get; private set; }

    public decimal Amount { get; private set; }

    public decimal? Quantity { get; private set; }

    public decimal? Price { get; private set; }

    public decimal? Fee { get; private set; }

    public decimal FxRateToCad { get; private set; }

    public string? InstrumentSymbol { get; private set; }

    public string? Notes { get; private set; }

    protected Activity()
    {
        Currency = string.Empty;
    }

    public Activity(
        Guid id,
        Guid accountId,
        ActivityType type,
        DateTime tradeDate,
        string currency,
        decimal amount,
        decimal? quantity,
        decimal? price,
        decimal? fee,
        decimal fxRateToCad,
        string? instrumentSymbol,
        string? notes)
        : base(id)
    {
        AccountId = accountId;
        Type = type;
        TradeDate = tradeDate;
        Currency = NormalizeCurrency(currency);
        Amount = amount;
        Quantity = quantity;
        Price = price;
        Fee = fee;
        FxRateToCad = fxRateToCad;
        InstrumentSymbol = NormalizeSymbol(instrumentSymbol);
        Notes = NormalizeNotes(notes);

        ValidateByType();
    }

    private void ValidateByType()
    {
        if (Amount <= 0)
        {
            throw new BusinessException("Activity.AmountMustBePositive");
        }

        if (FxRateToCad <= 0)
        {
            throw new BusinessException("Activity.FxRateMustBePositive");
        }

        if (Type is ActivityType.Buy or ActivityType.Sell)
        {
            if (string.IsNullOrWhiteSpace(InstrumentSymbol) || !Quantity.HasValue || !Price.HasValue)
            {
                throw new BusinessException("Activity.TradeFieldsRequired");
            }

            if (Quantity.Value <= 0 || Price.Value <= 0)
            {
                throw new BusinessException("Activity.TradeQuantityAndPriceMustBePositive");
            }
        }

        if (Type is ActivityType.Deposit or ActivityType.Withdraw or ActivityType.Expense)
        {
            if (Quantity.HasValue || Price.HasValue || !string.IsNullOrWhiteSpace(InstrumentSymbol))
            {
                throw new BusinessException("Activity.CashActivityCannotContainTradeFields");
            }
        }
    }

    private static string NormalizeCurrency(string currency)
    {
        var normalized = Check.NotNullOrWhiteSpace(
            currency,
            nameof(currency),
            ActivityConsts.CurrencyMaxLength,
            ActivityConsts.CurrencyMaxLength
        );
        return normalized.ToUpperInvariant();
    }

    private static string? NormalizeSymbol(string? instrumentSymbol)
    {
        if (string.IsNullOrWhiteSpace(instrumentSymbol))
        {
            return null;
        }

        return Check.Length(
                instrumentSymbol.Trim().ToUpperInvariant(),
                nameof(instrumentSymbol),
                ActivityConsts.InstrumentSymbolMaxLength,
                1
            );
    }

    private static string? NormalizeNotes(string? notes)
    {
        if (string.IsNullOrWhiteSpace(notes))
        {
            return null;
        }

        return Check.Length(notes.Trim(), nameof(notes), ActivityConsts.NotesMaxLength, 1);
    }
}
