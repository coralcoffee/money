import z from 'zod';
import { Button } from '@/components/ui/button';

const exchangeRateSchema = z.object({
  fromCurrency: z.string().min(1, 'From Currency is required'),
  toCurrency: z.string().min(1, 'To Currency is required'),
  rate: z.coerce
    .number()
    .min(0, { message: 'Rate must be a non-negative number.' }),
});

type ExchangeRateFormData = z.infer<typeof exchangeRateSchema>;

interface AddExchangeRateFormProps {
  onSubmit: (newRate: ExchangeRateFormData) => void;
  onCancel: () => void;
}

export const AddExchangeRateForm = ({
  onSubmit,
  onCancel,
}: AddExchangeRateFormProps) => {
  const handleSubmit = () => {
    const validation = exchangeRateSchema.safeParse({
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      rate: 1,
    });

    if (validation.success) {
      onSubmit(validation.data);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Add Exchange Rate form is not implemented yet.
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};
