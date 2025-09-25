import AppLayout from '@/layouts/AppLayout';
import ApiDefinition from '../features/apiDefinition/ApiDefinition';
import Dashboard from '../features/Dashboard/Index';
import Home from '../features/Home';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';
import { renderRoutes } from './GenerateRoute';

export interface AppRoute {
  name: string;
  title: string;
  component?: React.ComponentType<unknown>;
  path?: string;
  routes?: AppRoute[];
}

export interface AppLayout {
  layout: React.ComponentType<unknown>;
  isPublic?: boolean;
  routes: AppRoute[];
}

export const routes: AppLayout[] = [
  {
    layout: AppLayout,
    isPublic: true,
    routes: [
      {
        name: 'Home',
        title: 'Home',
        path: '/',
        component: Home,
      },
    ],
  },
  {
    layout: DashboardLayout,
    isPublic: false,
    routes: [
      {
        name: 'Dashboard',
        title: 'Dashboard',
        path: '/dashboard',
        component: Dashboard,
      },
      {
        name: 'apiDefinition',
        title: 'API Definition',
        path: '/api-definition',
        component: ApiDefinition,
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
