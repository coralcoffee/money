import { Separator } from '@/components/ui/separator';
import { SettingsHeader } from '@/layouts/AppLayout/SettingsHeader';
import { BaseCurrencySettings } from './BaseCurrencySettings';

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader
        heading="General"
        text="Manage the general application settings and preferences."
      />
      <Separator />
      <BaseCurrencySettings />
      <div className="pt-6">ExchangeRatesSettings</div>
      <div className="pt-6">AutoUpdateSettings</div>
    </div>
  );
}
