import { CurrencyInput } from '@/components/financial/CurrencyInput';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useSettings } from '@/hooks/useSettings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const baseCurrencyFormSchema = z.object({
  baseCurrency: z.string().min(1, 'Please select a base currency.'),
});

type BaseCurrencyFormValues = z.infer<typeof baseCurrencyFormSchema>;

export function BaseCurrencyForm() {
  const { settings } = useSettings();
  const defaultValues: Partial<BaseCurrencyFormValues> = {
    baseCurrency: settings?.baseCurrency || 'USD',
  };
  const form = useForm<BaseCurrencyFormValues>({
    resolver: zodResolver(baseCurrencyFormSchema),
    defaultValues,
    // Reset form when settings change from external source
    values: { baseCurrency: settings?.baseCurrency || 'USD' },
  });

  async function onSubmit(data: BaseCurrencyFormValues) {
    try {
      // await updateBaseCurrency(data.baseCurrency);
    } catch (error) {
      console.error('Failed to update currency settings:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="baseCurrency"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormControl className="w-[300px]">
                <CurrencyInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Currency</Button>{' '}
      </form>
    </Form>
  );
}

export function BaseCurrencySettings() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Base Currency</CardTitle>
          <CardDescription>
            Select your portfolio base currency.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <BaseCurrencyForm />
      </CardContent>
    </Card>
  );
}
