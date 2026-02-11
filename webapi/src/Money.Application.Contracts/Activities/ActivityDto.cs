using System;
using Volo.Abp.Application.Dtos;

namespace Money.Activities;

public class ActivityDto : AuditedEntityDto<Guid>
{
    public Guid AccountId { get; set; }

    public ActivityType Type { get; set; }

    public DateTime TradeDate { get; set; }

    public string Currency { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? Price { get; set; }

    public decimal? Fee { get; set; }

    public decimal FxRateToCad { get; set; }

    public string? InstrumentSymbol { get; set; }

    public string? Notes { get; set; }
}
