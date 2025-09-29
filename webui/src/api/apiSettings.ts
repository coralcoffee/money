import { createApi } from '@reduxjs/toolkit/query/react';
import { Settings } from '@/types/settings';
import type { RootState } from '@/store/appStore';
import apiBase from './ApiBase';
import { AxiosError } from 'axios';

// Define the expected argument types for the base query
interface BaseQueryArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, unknown>;
}

// Custom base query that uses ApiBase
const apiBaseQuery = async (args: string | BaseQueryArgs) => {
  try {
    const { url, method = 'GET', body, params } = typeof args === 'string' ? { url: args } : args;
    
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await apiBase.get(url, { params });
        break;
      case 'POST':
        response = await apiBase.post(url, body, { params });
        break;
      case 'PUT':
        response = await apiBase.put(url, body, { params });
        break;
      case 'DELETE':
        response = await apiBase.delete(url, { params });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return { data: response.data };
  } catch (axiosError) {
    const error = axiosError as AxiosError;
    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data || error.message,
      },
    };
  }
};

// Define the API slice
export const apiSettings = createApi({
  reducerPath: 'apiSettings',
  baseQuery: apiBaseQuery,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    // Get settings query
    getSettings: builder.query<Settings, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    
    // Update settings mutation
    updateSettings: builder.mutation<Settings, Partial<Settings>>({
      query: (updates) => ({
        url: '/settings',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Settings'],
      // Optimistic update
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSettings.util.updateQueryData('getSettings', undefined, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    // Update base currency specifically
    updateBaseCurrency: builder.mutation<Settings, string>({
      query: (baseCurrency) => ({
        url: '/settings',
        method: 'PUT', 
        body: { baseCurrency },
      }),
      invalidatesTags: ['Settings'],
      // Optimistic update
      async onQueryStarted(baseCurrency, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSettings.util.updateQueryData('getSettings', undefined, (draft) => {
            draft.baseCurrency = baseCurrency;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateBaseCurrencyMutation,
} = apiSettings;

// Export selectors for direct access to cached data
export const selectSettings = (state: RootState) => 
  apiSettings.endpoints.getSettings.select()(state)?.data;

export const selectSettingsLoading = (state: RootState) =>
  apiSettings.endpoints.getSettings.select()(state)?.isLoading ?? false;

export const selectSettingsError = (state: RootState) =>
  apiSettings.endpoints.getSettings.select()(state)?.error;