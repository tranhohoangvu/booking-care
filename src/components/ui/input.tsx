import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[oklch(0.52_0.014_90)]">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-[12px] border border-[oklch(0.86_0.014_90)] bg-white px-3.5 py-2 text-xs text-[oklch(0.2_0.012_250)] placeholder:text-[oklch(0.52_0.014_90)] transition-all duration-[120ms] focus:border-[oklch(0.54_0.19_240)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.54_0.19_240_/_0.15)] disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-9',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
