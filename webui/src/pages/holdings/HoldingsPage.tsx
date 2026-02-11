import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { investmentClient } from '@/api/clients/investmentClient';
import type { Activity } from '@/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type HoldingRow = {
  key: string;
  accountId: string;
  symbol: string;
  quantity: number;
  costCad: number;
};

export default function HoldingsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        setActivities(await investmentClient.getActivities());
      } catch (error) {
        toast.error('Failed to load holdings');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const holdings = useMemo<HoldingRow[]>(() => {
    const map = new Map<string, HoldingRow>();
    for (const activity of activities) {
      if (!activity.instrumentSymbol || !activity.quantity) {
        continue;
      }
      if (activity.type !== 'Buy' && activity.type !== 'Sell') {
        continue;
      }
      const key = `${activity.accountId}:${activity.instrumentSymbol}`;
      const current =
        map.get(key) ??
        ({
          key,
          accountId: activity.accountId,
          symbol: activity.instrumentSymbol,
          quantity: 0,
          costCad: 0,
        } as HoldingRow);

      const multiplier = activity.type === 'Buy' ? 1 : -1;
      current.quantity += multiplier * activity.quantity;
      current.costCad +=
        multiplier *
        activity.quantity *
        (activity.price ?? 0) *
        activity.fxRateToCad;
      map.set(key, current);
    }
    return Array.from(map.values()).filter((row) => row.quantity > 0);
  }, [activities]);

  return (
    <div className="space-y-6 p-6">
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Holdings (Derived)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-3">
              {holdings.map((row) => (
                <div
                  key={row.key}
                  className="grid rounded-md border p-3 text-sm md:grid-cols-4"
                >
                  <p className="font-medium">{row.symbol}</p>
                  <p>Qty: {row.quantity.toLocaleString()}</p>
                  <p>Cost (CAD): {row.costCad.toLocaleString()}</p>
                  <p className="text-muted-foreground">{row.accountId}</p>
                </div>
              ))}
              {!holdings.length && (
                <p className="text-sm text-muted-foreground">No open holdings yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

