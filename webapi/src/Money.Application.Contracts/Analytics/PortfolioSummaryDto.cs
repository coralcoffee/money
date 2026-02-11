namespace Money.Analytics;

public class PortfolioSummaryDto
{
    public decimal TotalInvestedCad { get; set; }

    public decimal TotalValueCad { get; set; }

    public decimal RealizedPnlCad { get; set; }

    public decimal UnrealizedPnlCad { get; set; }

    public decimal TotalProfitLossCad { get; set; }
}
