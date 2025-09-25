import { Route, Routes as ReactRoutes } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { AppLayout, AppRoute } from '.';
import NotFound from '@/pages/NotFound';

const renderNestedRoutes = (
  routes: AppRoute[],
  isPublic?: boolean,
  isAuthorized?: boolean,
): React.ReactNode[] => {
  if (!routes) return [];

  return routes
    .map((route, index) => {
      const {
        component: Component,
        path,
        name,
        layout: NestedLayout,
        routes: subRoutes,
      } = route;

      // If this route has a nested layout, render it with its own nested routes
      if (NestedLayout && subRoutes) {
        return (
          <Route
            key={`${name}-${index}`}
            path={path}
            element={<NestedLayout />}
          >
            <Route
              element={
                <ProtectedRoute
                  isPublic={isPublic}
                  isAuthorized={isAuthorized || false}
                />
              }
            >
              {renderNestedRoutes(subRoutes, isPublic, isAuthorized)}
            </Route>
          </Route>
        );
      }

      // If this route has subRoutes but no layout, render them directly
      if (subRoutes && !NestedLayout) {
        return [
          Component && path && (
            <Route
              key={`${name}-${index}`}
              element={<Component />}
              path={path}
            />
          ),
          ...renderNestedRoutes(subRoutes, isPublic, isAuthorized),
        ].filter(Boolean);
      }

      // Regular route with component
      if (Component && path) {
        return (
          <Route key={`${name}-${index}`} element={<Component />} path={path} />
        );
      }

      return null;
    })
    .filter(Boolean)
    .flat();
};

export const renderRoutes = (mainRoutes: AppLayout[]) => {
  const Routes = ({ isAuthorized }: { isAuthorized: boolean }) => {
    const layouts = mainRoutes.map(
      ({ layout: Layout, isPublic, routes }, index) => {
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
              {renderNestedRoutes(routes, isPublic, isAuthorized)}
            </Route>
          </Route>
        );
      },
    );
    return (
      <ReactRoutes>
        {layouts}
        <Route path="*" element={<NotFound />} />
      </ReactRoutes>
    );
  };
  return Routes;
};
