export interface Settings {
  theme: string;
  font: string;
  baseCurrency: string;
  onboardingCompleted: boolean;
  autoUpdateCheckEnabled: boolean;
  menuBarVisible: boolean;
}

export interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  isError: boolean;
  updateBaseCurrency: (currency: Settings['baseCurrency']) => Promise<void>;
  accountsGrouped: boolean;
  setAccountsGrouped: (value: boolean) => void;
}
