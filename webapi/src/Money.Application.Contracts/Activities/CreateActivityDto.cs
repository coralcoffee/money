using System;
using System.ComponentModel.DataAnnotations;

namespace Money.Activities;

public class CreateActivityDto
{
    [Required]
    public Guid AccountId { get; set; }

    [Required]
    public ActivityType Type { get; set; }

    [Required]
    public DateTime TradeDate { get; set; }

    [Required]
    [StringLength(ActivityConsts.CurrencyMaxLength, MinimumLength = ActivityConsts.CurrencyMaxLength)]
    public string Currency { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? Price { get; set; }

    public decimal? Fee { get; set; }

    [Required]
    public decimal FxRateToCad { get; set; }

    [StringLength(ActivityConsts.InstrumentSymbolMaxLength)]
    public string? InstrumentSymbol { get; set; }

    [StringLength(ActivityConsts.NotesMaxLength)]
    public string? Notes { get; set; }
}
