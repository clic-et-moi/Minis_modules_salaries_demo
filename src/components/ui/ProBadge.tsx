import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface ProBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Taille du badge */
  size?: 'sm' | 'md' | 'lg';
  /** Afficher ou non l’icône Sparkles */
  showIcon?: boolean;
}

const sizeClasses = {
  sm: 'text-[10px] xs:text-xs px-1.5 py-0.5 gap-0.5 [&_svg]:w-2.5 [&_svg]:h-2.5',
  md: 'text-xs px-2 py-1 gap-1 [&_svg]:w-3 [&_svg]:h-3',
  lg: 'text-sm px-2.5 py-1 gap-1.5 [&_svg]:w-4 [&_svg]:h-4',
};

export const ProBadge = React.forwardRef<HTMLSpanElement, ProBadgeProps>(
  ({ className, size = 'sm', showIcon = true, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label="Module PRO"
        className={cn(
          'inline-flex items-center font-semibold rounded-md text-white tracking-wide',
          'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
          'shadow-sm border border-blue-400/30',
          'select-none',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span>PRO</span>
      </span>
    );
  }
);

ProBadge.displayName = 'ProBadge';
