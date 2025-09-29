import { configureStore } from '@reduxjs/toolkit';
import { settingsApi } from '@/api/settingsApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other useful features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(settingsApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
