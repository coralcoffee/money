import AppLayout from '@/layouts/AppLayout';
import Home from '../features/Home';
import { renderRoutes } from './GenerateRoute';
import SettingsLayout from '@/layouts/SettingsLayout';
import GeneralSettingsPage from '@/pages/settings/GeneralSettingsPage';

export interface AppRoute {
  name: string;
  component?: React.ComponentType<unknown>;
  path?: string;
  routes?: AppRoute[];
}

export interface AppLayout {
  layout: React.ComponentType<unknown>;
  isPublic?: boolean;
  routes: AppRoute[];
}

const routes: AppLayout[] = [
  {
    layout: AppLayout,
    isPublic: true,
    routes: [
      {
        name: 'Home',
        path: '/',
        component: Home,
      },
    ],
  },
  {
    layout: SettingsLayout,
    isPublic: true,
    routes: [
      {
        name: 'GeneralSettings',
        path: '/settings/general',
        component: GeneralSettingsPage,
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
