import { configureStore } from '@reduxjs/toolkit';
import { apiSettings } from '@/api/apiSettings';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [apiSettings.reducerPath]: apiSettings.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other useful features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSettings.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
