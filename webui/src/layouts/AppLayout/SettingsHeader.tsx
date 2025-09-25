import { cn } from '@/lib/utils';
interface SettingsHeaderProps {
  heading: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SettingsHeader({
  heading,
  text,
  className,
  children,
}: SettingsHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="grid gap-1">
        <h1 className="font-heading text-xl font-bold">{heading}</h1>
        {text && (
          <p className="text-md text-muted-foreground font-light">{text}</p>
        )}
      </div>
      {children}
    </div>
  );
}
