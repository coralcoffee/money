import { Settings, SettingsContextType } from "@/types/settings";
import { useSettings } from "@/hooks/useSettings";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ExtendedSettingsContextType extends SettingsContextType {
  updateSettings: (
    updates: Partial<
      Pick<
        Settings,
        'theme' | 'font' | 'baseCurrency' | 'onboardingCompleted' | 'menuBarVisible'
      >
    >,
  ) => Promise<void>;
  isUpdating: boolean;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { 
    settings, 
    isLoading, 
    isError, 
    updateBaseCurrency: updateBaseCurrencyMutation,
    updateSettings: updateSettingsMutation,
    isUpdating
  } = useSettings();
  
  const [accountsGrouped, setAccountsGrouped] = useState(true);

  const updateBaseCurrency = async (baseCurrency: Settings['baseCurrency']) => {
    await updateBaseCurrencyMutation(baseCurrency);
  };

  // Batch update function
  const updateSettings = async (
    updates: Partial<
      Pick<
        Settings,
        'theme' | 'font' | 'baseCurrency' | 'onboardingCompleted' | 'menuBarVisible'
      >
    >,
  ) => {
    await updateSettingsMutation(updates);
  };

  useEffect(() => {
    if (settings) {
      applySettingsToDocument(settings);
    }
  }, [settings]);

  const contextValue: ExtendedSettingsContextType = {
    settings: settings ?? null,
    isLoading,
    isError,
    updateBaseCurrency,
    updateSettings,
    accountsGrouped,
    setAccountsGrouped,
    isUpdating,
  };

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}

const SettingsContext = createContext<ExtendedSettingsContextType | undefined>(undefined);

const applySettingsToDocument = async (newSettings: Settings) => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(newSettings.theme);

  document.body.classList.remove('font-mono', 'font-sans', 'font-serif');
  document.body.classList.add(newSettings.font);

  // Color scheme must be applied to document element (`<html>`)
  document.documentElement.style.colorScheme = newSettings.theme;
  // const currentWindow = await getCurrentWindow();
  // currentWindow.setTheme(newSettings.theme as Theme);
};
