import { useCallback } from 'react';
import { 
  useGetSettingsQuery, 
  useUpdateSettingsMutation, 
  useUpdateBaseCurrencyMutation 
} from '@/api/settingsApi';
import { Settings } from '@/types/settings';

/**
 * Custom hook for managing settings with RTK Query
 * Provides a unified interface for reading and updating settings
 */
export function useSettings() {
  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSettingsQuery();

  const [updateSettingsMutation, { 
    isLoading: isUpdating,
    error: updateError 
  }] = useUpdateSettingsMutation();

  const [updateBaseCurrencyMutation, { 
    isLoading: isUpdatingCurrency,
    error: currencyError 
  }] = useUpdateBaseCurrencyMutation();

  // Update multiple settings at once
  const updateSettings = useCallback(
    async (updates: Partial<Settings>) => {
      try {
        await updateSettingsMutation(updates).unwrap();
      } catch (error) {
        console.error('Failed to update settings:', error);
        throw error;
      }
    },
    [updateSettingsMutation]
  );

  // Update base currency specifically
  const updateBaseCurrency = useCallback(
    async (currency: string) => {
      try {
        await updateBaseCurrencyMutation(currency).unwrap();
      } catch (error) {
        console.error('Failed to update base currency:', error);
        throw error;
      }
    },
    [updateBaseCurrencyMutation]
  );

  // Update individual setting properties
  const updateTheme = useCallback(
    (theme: string) => updateSettings({ theme }),
    [updateSettings]
  );

  const updateFont = useCallback(
    (font: string) => updateSettings({ font }),
    [updateSettings]
  );

  const updateOnboardingCompleted = useCallback(
    (onboardingCompleted: boolean) => updateSettings({ onboardingCompleted }),
    [updateSettings]
  );

  const updateAutoUpdateCheckEnabled = useCallback(
    (autoUpdateCheckEnabled: boolean) => updateSettings({ autoUpdateCheckEnabled }),
    [updateSettings]
  );

  const updateMenuBarVisible = useCallback(
    (menuBarVisible: boolean) => updateSettings({ menuBarVisible }),
    [updateSettings]
  );

  return {
    // Data
    settings,
    isLoading,
    isError,
    error,
    
    // Mutation states
    isUpdating: isUpdating || isUpdatingCurrency,
    updateError: updateError || currencyError,
    
    // Actions
    refetch,
    updateSettings,
    updateBaseCurrency,
    updateTheme,
    updateFont,
    updateOnboardingCompleted,
    updateAutoUpdateCheckEnabled,
    updateMenuBarVisible,
  };
}

/**
 * Hook for accessing settings in a read-only manner
 * Useful for components that only need to display settings
 */
export function useSettingsReadOnly() {
  const { 
    data: settings, 
    isLoading, 
    isError, 
    error 
  } = useGetSettingsQuery();

  return {
    settings,
    isLoading,
    isError,
    error,
  };
}

/**
 * Hook for getting a specific setting value
 * @param key - The setting key to retrieve
 * @returns The setting value or undefined if not loaded
 */
export function useSetting<K extends keyof Settings>(key: K): Settings[K] | undefined {
  const { settings } = useSettingsReadOnly();
  return settings?.[key];
}

/**
 * Hook for checking if settings are loaded and ready
 */
export function useSettingsReady() {
  const { settings, isLoading, isError } = useSettingsReadOnly();
  return {
    isReady: !isLoading && !isError && !!settings,
    settings,
    isLoading,
    isError,
  };
}