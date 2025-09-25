import { Settings } from '@/types/settings';
import ApiBase from './ApiBase';

export async function getSettings(): Promise<Settings> {
  const response = await ApiBase.get<Settings>('/settings');
  return response.data;
}
