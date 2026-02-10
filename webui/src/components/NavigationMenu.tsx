import { cn } from '@/lib/utils';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { NavigationMenuViewport } from './ui/navigation-menu';

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuViewport className="mt-8" />
    </NavigationMenuPrimitive.Root>
  );
}

export { NavigationMenu };
