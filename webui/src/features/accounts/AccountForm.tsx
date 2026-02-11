import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AccountType, CreateAccountInput, OwnerType } from '@/types/investment';

const accountTypes: AccountType[] = [
  'Cash',
  'RRSP',
  'TFSA',
  'NonRegistered',
  'Chequing',
  'Saving',
  'RESP',
];

const ownerTypes: OwnerType[] = ['Personal', 'Corporate'];

type Props = {
  onSubmit: (data: CreateAccountInput) => Promise<void>;
};

export default function AccountForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CreateAccountInput>({
    name: '',
    accountType: 'Cash',
    ownerType: 'Personal',
    accountNumber: '',
    brokerOrInstitution: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      setForm({
        name: '',
        accountType: 'Cash',
        ownerType: 'Personal',
        accountNumber: '',
        brokerOrInstitution: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Questrade Margin"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accountType">Account Type</Label>
        <select
          id="accountType"
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
          value={form.accountType}
          onChange={(event) =>
            setForm({ ...form, accountType: event.target.value as AccountType })
          }
        >
          {accountTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ownerType">Owner Type</Label>
        <select
          id="ownerType"
          className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
          value={form.ownerType}
          onChange={(event) =>
            setForm({ ...form, ownerType: event.target.value as OwnerType })
          }
        >
          {ownerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          value={form.accountNumber}
          onChange={(event) =>
            setForm({ ...form, accountNumber: event.target.value })
          }
          placeholder="ACC-1234"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="institution">Broker / Institution</Label>
        <Input
          id="institution"
          value={form.brokerOrInstitution}
          onChange={(event) =>
            setForm({ ...form, brokerOrInstitution: event.target.value })
          }
          placeholder="Questrade"
          required
        />
      </div>

      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Account'}
        </Button>
      </div>
    </form>
  );
}

