import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';

export interface NavLink {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavigationSection {
  title: string;
  buttons: NavLink[];
}

export function NavItem({
  item,
  className,
  collapsed,
  ...props
}: {
  item: NavLink;
  className?: string;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      key={item.title}
      variant={location.pathname.includes(item.href) ? 'secondary' : 'ghost'}
      asChild
      className={cn('text-foreground h-12 justify-start', className)}
    >
      <Link key={item.title} to={item.href} title={item.title} {...props}>
        {item.icon ?? (
          <Icons.ArrowRight className="h-6 w-6" aria-hidden="true" />
        )}

        <span
          className={cn({
            'ml-2 transition-opacity delay-100 duration-300 ease-in-out': true,
            'sr-only opacity-0': collapsed,
            'block opacity-100': !collapsed,
          })}
        >
          {item.title}
        </span>
      </Link>
    </Button>
  );
}
