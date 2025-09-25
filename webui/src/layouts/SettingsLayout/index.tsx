import { Separator } from '@/components/ui/separator';
import { Outlet } from 'react-router';
import { SidebarNav } from './SidebarNav';

const sidebarNavItems = [
  {
    title: 'General',
    href: '/settings/general',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
  {
    title: 'Accounts',
    href: '/settings/accounts',
  },
  {
    title: 'Limits',
    href: '/settings/contribution-limits',
  },
  {
    title: 'Goals',
    href: '/settings/goals',
  },
  {
    title: 'Market Data',
    href: '/settings/market-data',
  },
  {
    title: 'Add-ons',
    href: '/settings/addons',
  },
  {
    title: 'Data Export',
    href: '/settings/exports',
  },
  {
    title: 'About',
    href: '/settings/about',
  },
];

export default function SettingsLayout() {
  return (
    <>
      <div className="block p-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          {/* <p className="text-muted-foreground">Manage the application settings and preferences.</p> */}
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
