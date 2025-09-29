import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Settings } from '@/types/settings';
import type { RootState } from '@/store/appStore';

// Define the API slice
export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add any auth headers here if needed
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
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
          settingsApi.util.updateQueryData('getSettings', undefined, (draft) => {
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
          settingsApi.util.updateQueryData('getSettings', undefined, (draft) => {
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
} = settingsApi;

// Export selectors for direct access to cached data
export const selectSettings = (state: RootState) => 
  settingsApi.endpoints.getSettings.select()(state)?.data;

export const selectSettingsLoading = (state: RootState) =>
  settingsApi.endpoints.getSettings.select()(state)?.isLoading ?? false;

export const selectSettingsError = (state: RootState) =>
  settingsApi.endpoints.getSettings.select()(state)?.error;