import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AccountForm from '@/features/accounts/AccountForm';
import { investmentClient } from '@/api/clients/investmentClient';
import type { Account, CreateAccountInput } from '@/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      setAccounts(await investmentClient.getAccounts());
    } catch (error) {
      toast.error('Failed to load accounts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAccounts();
  }, []);

  const handleCreate = async (payload: CreateAccountInput) => {
    await investmentClient.createAccount(payload);
    toast.success('Account created');
    await loadAccounts();
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Add Account</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm onSubmit={handleCreate} />
        </CardContent>
      </Card>

      <Card className="py-4">
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.accountType} · {account.ownerType}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.brokerOrInstitution}
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

