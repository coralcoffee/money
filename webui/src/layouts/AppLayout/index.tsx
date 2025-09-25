import { useState } from 'react';
import { useLocation } from 'react-router';
import { NavigationProps, SidebarNav } from './SideBarNav';
import { Icons } from '@/components/ui/icons';

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
      App Layout
    </div>
  );
};

export default AppLayout;
