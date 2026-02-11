import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { investmentClient } from '@/api/clients/investmentClient';
import SummaryCards from '@/features/analytics/SummaryCards';
import type { PortfolioPerformance, PortfolioSummary } from '@/types/investment';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [performance, setPerformance] = useState<PortfolioPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [nextSummary, nextPerformance] = await Promise.all([
          investmentClient.getSummary(),
          investmentClient.getPerformance(),
        ]);
        setSummary(nextSummary);
        setPerformance(nextPerformance);
      } catch (error) {
        toast.error('Failed to load analytics');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 text-white">
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio Analytics</h1>
        <p className="mt-1 text-sm text-white/85">
          CAD-normalized view of invested capital, P/L, and win/loss outcomes.
        </p>
      </div>

      {isLoading ? (
        <Card className="py-4">
          <CardContent>
            <p className="text-sm text-muted-foreground">Loading analytics...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <SummaryCards summary={summary} performance={performance} />
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Trade Outcome</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-3">
              <div className="rounded-md border p-3">
                Closed Trades: <strong>{performance?.closedTrades ?? 0}</strong>
              </div>
              <div className="rounded-md border p-3">
                Winners: <strong>{performance?.winningTrades ?? 0}</strong>
              </div>
              <div className="rounded-md border p-3">
                Losers: <strong>{performance?.losingTrades ?? 0}</strong>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

