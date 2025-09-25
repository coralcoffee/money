import Home from '@/features/Home';
import AppLayout from '@/layouts/AppLayout';
import SettingsLayout from '@/layouts/SettingsLayout';
import GeneralSettingsPage from '@/pages/settings/GeneralSettingsPage';
import { Routes, Route } from 'react-router';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<GeneralSettingsPage />} />
          <Route path="general" element={<GeneralSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
