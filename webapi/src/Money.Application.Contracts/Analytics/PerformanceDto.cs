namespace Money.Analytics;

public class PerformanceDto
{
    public int ClosedTrades { get; set; }

    public int WinningTrades { get; set; }

    public int LosingTrades { get; set; }

    public decimal WinRate { get; set; }

    public decimal RealizedPnlCad { get; set; }

    public decimal UnrealizedPnlCad { get; set; }

    public decimal TotalProfitLossCad { get; set; }
}
