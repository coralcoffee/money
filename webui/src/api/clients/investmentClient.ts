import baseClient from '@/api/clients/baseClient';
import type {
  Account,
  Activity,
  CreateAccountInput,
  CreateActivityInput,
  PortfolioPerformance,
  PortfolioSummary,
} from '@/types/investment';

type PagedResult<T> = {
  items: T[];
  totalCount: number;
};

export const investmentClient = {
  getAccounts: async (): Promise<Account[]> => {
    const result = await baseClient.get<PagedResult<Account>>('/api/app/account');
    return result.items ?? [];
  },

  createAccount: (payload: CreateAccountInput): Promise<Account> =>
    baseClient.post<Account, CreateAccountInput>('/api/app/account', payload),

  getActivities: async (): Promise<Activity[]> => {
    const result = await baseClient.get<PagedResult<Activity>>('/api/app/activity');
    return result.items ?? [];
  },

  createActivity: (payload: CreateActivityInput): Promise<Activity> =>
    baseClient.post<Activity, CreateActivityInput>('/api/app/activity', payload),

  getSummary: (): Promise<PortfolioSummary> =>
    baseClient.get<PortfolioSummary>('/api/analytics/summary'),

  getPerformance: (): Promise<PortfolioPerformance> =>
    baseClient.get<PortfolioPerformance>('/api/analytics/performance'),
};

