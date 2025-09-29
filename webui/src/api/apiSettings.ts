import { createApi } from '@reduxjs/toolkit/query/react';
import { Settings } from '@/types/settings';
import type { RootState } from '@/store/appStore';
import { apiBaseQuery } from './apiBaseQuery';

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