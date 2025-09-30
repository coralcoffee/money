import z from 'zod';

const exchangeRateSchema = z.object({
  fromCurrency: z.string().min(1, 'From Currency is required'),
  toCurrency: z.string().min(1, 'To Currency is required'),
  rate: z.coerce
    .number()
    .min(0, { message: 'Rate must be a non-negative number.' }),
});

type ExchangeRateFormData = z.infer<typeof exchangeRateSchema>;

interface AddExchangeRateFormProps {
  onSubmit: (newRate: Omit<ExchangeRate, 'id'>) => void;
  onCancel: () => void;
}

export const AddExchangeRateForm = ({
  onSubmit,
  onCancel,
}: AddExchangeRateFormProps) => {
  return <div>AddExchangeRateForm</div>;
};
