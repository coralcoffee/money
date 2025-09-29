import { Settings } from '@/types/settings';
import ApiBase from './ApiBase';

// Legacy API functions - prefer using RTK Query hooks instead
export async function getSettings(): Promise<Settings> {
  const response = await ApiBase.get<Settings>('/settings');
  return response.data;
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await ApiBase.put<Settings>('/settings', settings as any);
  return response.data;
}
