import flattenDeep from 'lodash/flattenDeep';
import { Route, Routes as ReactRoutes } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { AppLayout, AppRoute } from '.';
import NotFound from '@/pages/NotFound';

const generateFlattenRoutes = (routes: AppRoute[]): AppRoute[] => {
  if (!routes) return [];
  return flattenDeep(
    routes.map(({ routes: subRoutes, ...rest }) => [
      rest,
      generateFlattenRoutes(subRoutes ?? []),
    ]),
  );
};

export const renderRoutes = (mainRoutes: AppLayout[]) => {
  const Routes = ({ isAuthorized }: { isAuthorized: boolean }) => {
    const layouts = mainRoutes.map(
      ({ layout: Layout, isPublic, routes }, index) => {
        const subRoutes = generateFlattenRoutes(routes);
        return (
          <Route key={index} element={<Layout />}>
            <Route
              element={
                <ProtectedRoute
                  isPublic={isPublic}
                  isAuthorized={isAuthorized}
                />
              }
            >
              {subRoutes.map(({ component: Component, path, name }) => {
                return (
                  Component &&
                  path && (
                    <Route key={name} element={<Component />} path={path} />
                  )
                );
              })}
            </Route>
          </Route>
        );
      },
    );
    return (
      <ReactRoutes>
        {layouts} <Route path="*" element={<NotFound />} />
      </ReactRoutes>
    );
  };
  return Routes;
};
