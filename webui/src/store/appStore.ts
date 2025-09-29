import { configureStore } from '@reduxjs/toolkit';
import { apiSettings } from '@/api/apiSettings';

export const store = configureStore({
  reducer: {
    [apiSettings.reducerPath]: apiSettings.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSettings.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
