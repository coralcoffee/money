import AppLayout from '@/layouts/AppLayout';
import SettingsLayout from '@/layouts/SettingsLayout';
import GeneralSettingsPage from '@/pages/settings/GeneralSettingsPage';
import { Routes, Route } from 'react-router';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import AccountsPage from '@/pages/accounts/AccountsPage';
import ActivitiesPage from '@/pages/activities/ActivitiesPage';
import HoldingsPage from '@/pages/holdings/HoldingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<AnalyticsPage />} />
        <Route path="dashboard" element={<AnalyticsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="holdings" element={<HoldingsPage />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<GeneralSettingsPage />} />
          <Route path="general" element={<GeneralSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
