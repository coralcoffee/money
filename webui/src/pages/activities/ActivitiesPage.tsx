import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ActivityForm from '@/features/activities/ActivityForm';
import { investmentClient } from '@/api/clients/investmentClient';
import type { Account, Activity, CreateActivityInput } from '@/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivitiesPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const accountNames = useMemo(
    () => Object.fromEntries(accounts.map((account) => [account.id, account.name])),
    [accounts],
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [nextAccounts, nextActivities] = await Promise.all([
        investmentClient.getAccounts(),
        investmentClient.getActivities(),
      ]);
      setAccounts(nextAccounts);
      setActivities(nextActivities);
    } catch (error) {
      toast.error('Failed to load activities');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async (payload: CreateActivityInput) => {
    await investmentClient.createActivity(payload);
    toast.success('Activity added');
    await loadData();
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Add Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityForm accounts={accounts} onSubmit={handleCreate} />
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="grid gap-2 rounded-md border p-3 md:grid-cols-5 md:items-center"
                >
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.tradeDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {accountNames[activity.accountId] ?? activity.accountId}
                  </p>
                  <p className="text-sm">
                    {activity.currency} {activity.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.instrumentSymbol ?? '-'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    FX {activity.fxRateToCad}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

