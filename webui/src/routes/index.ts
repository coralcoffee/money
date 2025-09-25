import AppLayout from '@/layouts/AppLayout';
import Home from '../features/Home';
import { renderRoutes } from './GenerateRoute';
import SettingsLayout from '@/layouts/SettingsLayout';
import GeneralSettingsPage from '@/pages/settings/GeneralSettingsPage';
import AboutSettingsPage from '@/pages/settings/AboutSettingsPage';

export interface AppRoute {
  name: string;
  component?: React.ComponentType<unknown>;
  path?: string;
  routes?: AppRoute[];
  layout?: React.ComponentType<unknown>;
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
      {
        name: 'Settings',
        path: '/settings',
        layout: SettingsLayout,
        routes: [
          {
            name: 'GeneralSettings',
            path: '/settings/general',
            component: GeneralSettingsPage,
          },
          {
            name: 'AboutSettings',
            path: '/settings/about',
            component: AboutSettingsPage,
          },
        ],
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
