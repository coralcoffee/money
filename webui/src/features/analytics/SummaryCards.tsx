import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioPerformance, PortfolioSummary } from '@/types/investment';

type Props = {
  summary: PortfolioSummary | null;
  performance: PortfolioPerformance | null;
};

function money(value: number | undefined): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export default function SummaryCards({ summary, performance }: Props) {
  const winRate = ((performance?.winRate ?? 0) * 100).toFixed(1);

  const stats = [
    { label: 'Total Invested', value: money(summary?.totalInvestedCad) },
    { label: 'Total Value', value: money(summary?.totalValueCad) },
    { label: 'Realized P/L', value: money(summary?.realizedPnlCad) },
    { label: 'Unrealized P/L', value: money(summary?.unrealizedPnlCad) },
    { label: 'Total P/L', value: money(summary?.totalProfitLossCad) },
    {
      label: 'Win/Loss',
      value: `${performance?.winningTrades ?? 0}/${performance?.losingTrades ?? 0} (${winRate}%)`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-l-4 border-l-emerald-500/70 py-4">
          <CardHeader className="px-4 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-2">
            <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

