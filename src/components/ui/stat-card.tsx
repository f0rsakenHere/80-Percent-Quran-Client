import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  variant = 'default',
  className,
}: StatCardProps) {
  const variants = {
    default: 'bg-card/50 border-border/50',
    primary: 'bg-primary/10 border-primary/20',
    accent: 'bg-accent/10 border-accent/20',
  };

  const textColors = {
    default: 'text-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
  };

  return (
    <Card className={cn('p-5 h-full backdrop-blur-sm transition-all hover:scale-[1.02]', variants[variant], className)}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && <div className={cn("opacity-80", textColors[variant])}>{icon}</div>}
      </div>
      <div className={cn("text-2xl font-bold mb-1", textColors[variant])}>
        {value}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </Card>
  );
}
