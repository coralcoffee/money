import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { NavItem, NavLink } from './NavItem';

export interface NavigationProps {
  primary: NavLink[];
  secondary?: NavLink[];
}

export function SidebarNav({ navigation }: { navigation: NavigationProps }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={cn({
        'light:bg-secondary/50 box-border h-screen border-r pt-12 transition-[width] duration-300 ease-in-out md:flex': true,
        'md:w-sidebar': !collapsed,
        'md:w-sidebar-collapsed': collapsed,
      })}
      data-tauri-drag-region="true"
    >
      <div className="z-20 w-full rounded-xl md:flex">
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            <div data-tauri-drag-region="true" className="flex-1">
              <nav
                data-tauri-drag-region="true"
                aria-label="Sidebar"
                className="flex flex-shrink-0 flex-col p-2"
              >
                <div
                  data-tauri-drag-region="true"
                  className="draggable flex items-center justify-center pb-12"
                >
                  <Link to="/">
                    <img
                      className={`h-10 w-10 rounded-full bg-transparent shadow-lg duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(-180deg)] ${
                        collapsed ? '[transform:rotateY(180deg)]' : ''
                      }`}
                      aria-hidden="true"
                      src={logo}
                    />
                  </Link>
                  <span
                    className={cn(
                      'text-md ml-2 font-bold transition-opacity delay-100 duration-300 ease-in-out',
                      {
                        'sr-only opacity-0': collapsed,
                        'block opacity-100': !collapsed,
                      },
                    )}
                  >
                    MoneyWise
                  </span>
                </div>
                {navigation?.primary?.map((item) =>
                  NavItem({ item, collapsed }),
                )}
              </nav>
            </div>
            <div className="flex flex-shrink-0 flex-col p-2">
              {navigation?.secondary?.map((item) =>
                NavItem({ item, collapsed }),
              )}
              <Separator className="mt-0" />
              <div className="flex justify-end">
                <Button
                  title="Toggle Sidebar"
                  variant="ghost"
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-gray-400 hover:bg-transparent"
                  aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  <Icons.PanelLeftOpen
                    size={18}
                    className={`h-5 w-5 duration-500 ${!collapsed && 'rotate-180'}`}
                    aria-label={
                      collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'
                    }
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
