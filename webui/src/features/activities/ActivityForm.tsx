import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Account, ActivityType, CreateActivityInput } from '@/types/investment';

const activityTypes: ActivityType[] = [
  'Deposit',
  'Withdraw',
  'Expense',
  'Buy',
  'Sell',
  'Dividend',
  'Fee',
  'FxTransfer',
];

type Props = {
  accounts: Account[];
  onSubmit: (data: CreateActivityInput) => Promise<void>;
};

export default function ActivityForm({ accounts, onSubmit }: Props) {
  const defaultAccountId = useMemo(() => accounts[0]?.id ?? '', [accounts]);
  const [form, setForm] = useState<CreateActivityInput>({
    accountId: defaultAccountId,
    type: 'Deposit',
    tradeDate: new Date().toISOString(),
    currency: 'CAD',
    amount: 0,
    quantity: null,
    price: null,
    fee: null,
    fxRateToCad: 1,
    instrumentSymbol: null,
    notes: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (defaultAccountId && !form.accountId) {
      setForm((previous) => ({ ...previous, accountId: defaultAccountId }));
    }
  }, [defaultAccountId, form.accountId]);

  const isTrade = form.type === 'Buy' || form.type === 'Sell';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        quantity: isTrade ? form.quantity : null,
        price: isTrade ? form.price : null,
        instrumentSymbol: isTrade ? form.instrumentSymbol : null,
      });
      setForm({
        accountId: defaultAccountId,
        type: 'Deposit',
        tradeDate: new Date().toISOString(),
        currency: 'CAD',
        amount: 0,
        quantity: null,
        price: null,
        fee: null,
        fxRateToCad: 1,
        instrumentSymbol: null,
        notes: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="account">Account</Label>
        <select
          id="account"
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
          value={form.accountId}
          onChange={(event) => setForm({ ...form, accountId: event.target.value })}
          required
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Activity Type</Label>
        <select
          id="type"
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
          value={form.type}
          onChange={(event) =>
            setForm({ ...form, type: event.target.value as ActivityType })
          }
        >
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tradeDate">Trade Date</Label>
        <Input
          id="tradeDate"
          type="date"
          value={form.tradeDate.slice(0, 10)}
          onChange={(event) =>
            setForm({ ...form, tradeDate: new Date(event.target.value).toISOString() })
          }
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="currency">Currency</Label>
        <Input
          id="currency"
          value={form.currency}
          onChange={(event) =>
            setForm({ ...form, currency: event.target.value.toUpperCase() })
          }
          minLength={3}
          maxLength={3}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="fxRateToCad">FX Rate To CAD</Label>
        <Input
          id="fxRateToCad"
          type="number"
          step="0.0001"
          value={form.fxRateToCad}
          onChange={(event) =>
            setForm({ ...form, fxRateToCad: Number(event.target.value) })
          }
          required
        />
      </div>

      {isTrade && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={form.instrumentSymbol ?? ''}
              onChange={(event) =>
                setForm({ ...form, instrumentSymbol: event.target.value.toUpperCase() })
              }
              required={isTrade}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.0001"
              value={form.quantity ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  quantity: event.target.value ? Number(event.target.value) : null,
                })
              }
              required={isTrade}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.0001"
              value={form.price ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  price: event.target.value ? Number(event.target.value) : null,
                })
              }
              required={isTrade}
            />
          </div>
        </>
      )}

      <div className="grid gap-2 md:col-span-3">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={form.notes ?? ''}
          onChange={(event) => setForm({ ...form, notes: event.target.value || null })}
          placeholder="Optional note"
        />
      </div>

      <div className="md:col-span-3">
        <Button type="submit" disabled={isSubmitting || !accounts.length}>
          {isSubmitting ? 'Saving...' : 'Add Activity'}
        </Button>
      </div>
    </form>
  );
}
