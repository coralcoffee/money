import React from 'react';
import { useSettings, useSettingsReadOnly, useSetting } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';

// Example component showing how to use the settings hooks
export function SettingsExample() {
  const {
    settings,
    isLoading,
    isError,
    isUpdating,
    updateTheme,
    updateBaseCurrency,
    updateSettings,
  } = useSettings();

  // Example of handling theme change
  const handleThemeToggle = () => {
    const newTheme = settings?.theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  // Example of handling currency change
  const handleCurrencyChange = (currency: string) => {
    updateBaseCurrency(currency);
  };

  // Example of batch updates
  const handleBatchUpdate = () => {
    updateSettings({
      theme: 'dark',
      baseCurrency: 'EUR',
      onboardingCompleted: true,
    });
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (isError) {
    return <div>Error loading settings</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Settings Management</h2>
      
      <div className="space-y-2">
        <p><strong>Theme:</strong> {settings?.theme}</p>
        <p><strong>Base Currency:</strong> {settings?.baseCurrency}</p>
        <p><strong>Font:</strong> {settings?.font}</p>
        <p><strong>Onboarding Completed:</strong> {settings?.onboardingCompleted ? 'Yes' : 'No'}</p>
      </div>

      <div className="space-x-2">
        <Button 
          onClick={handleThemeToggle} 
          disabled={isUpdating}
        >
          Toggle Theme
        </Button>
        
        <Button 
          onClick={() => handleCurrencyChange('USD')} 
          disabled={isUpdating}
        >
          Set USD
        </Button>
        
        <Button 
          onClick={() => handleCurrencyChange('EUR')} 
          disabled={isUpdating}
        >
          Set EUR
        </Button>
        
        <Button 
          onClick={handleBatchUpdate} 
          disabled={isUpdating}
        >
          Batch Update
        </Button>
      </div>
      
      {isUpdating && <p className="text-blue-600">Updating settings...</p>}
    </div>
  );
}

// Example of read-only component
export function SettingsDisplay() {
  const { settings, isLoading, isError } = useSettingsReadOnly();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="p-4">
      <h3>Current Settings (Read-Only)</h3>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
}

// Example of getting a specific setting
export function CurrencyDisplay() {
  const baseCurrency = useSetting('baseCurrency');
  
  return (
    <div className="p-4">
      <p>Current Currency: {baseCurrency || 'Loading...'}</p>
    </div>
  );
}