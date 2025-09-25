import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { NavigationProps, SidebarNav } from './SideBarNav';
import { Icons } from '@/components/ui/icons';
import { ErrorBoundary } from '@/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';

const staticNavigation: NavigationProps = {
  primary: [
    {
      icon: <Icons.Dashboard className="h-5 w-5" />,
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <Icons.Holdings className="h-5 w-5" />,
      title: 'Holdings',
      href: '/holdings',
    },
    {
      icon: <Icons.Performance className="h-5 w-5" />,
      title: 'Performance',
      href: '/performance',
    },
    {
      icon: <Icons.Income className="h-5 w-5" />,
      title: 'Income',
      href: '/income',
    },
    {
      icon: <Icons.Activity className="h-5 w-5" />,
      title: 'Activities',
      href: '/activities',
    },
  ],
  secondary: [
    {
      icon: <Icons.Settings className="h-5 w-5" />,
      title: 'Settings',
      href: '/settings/general',
    },
  ],
};
const AppLayout = () => {
  const location = useLocation();
  const [dynamicItems, setDynamicItems] = useState<any[]>([]);
  const navigation: NavigationProps = {
    primary: [...staticNavigation.primary, ...dynamicItems],
    secondary: staticNavigation.secondary,
  };
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <SidebarNav navigation={navigation} />
      <div className="relative flex w-full overflow-hidden">
        <div
          data-tauri-drag-region="true"
          className="draggable absolute left-0 right-0 top-0 h-6 w-full"
        >
          <ErrorBoundary>
            <main className="flex min-h-0 w-full flex-1 flex-col">
              <div className="flex-1 overflow-auto">
                <Outlet />
              </div>
            </main>
          </ErrorBoundary>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default AppLayout;
