import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-xs font-semibold tracking-tight transition-all duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.54_0.19_240)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[oklch(0.54_0.19_240)] text-white hover:bg-[oklch(0.48_0.19_240)] shadow-xs',
        destructive:
          'bg-[oklch(0.58_0.22_25)] text-white hover:bg-[oklch(0.52_0.22_25)] shadow-xs',
        outline:
          'border border-[oklch(0.86_0.014_90)] bg-white text-[oklch(0.2_0.012_250)] hover:bg-[oklch(0.97_0.012_95)] hover:border-[oklch(0.75_0.02_250)]',
        secondary:
          'bg-[oklch(0.95_0.04_240)] text-[oklch(0.48_0.19_240)] hover:bg-[oklch(0.91_0.06_240)] font-semibold',
        ghost:
          'text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.94_0.016_95)] hover:text-[oklch(0.2_0.012_250)]',
        pill:
          'rounded-full bg-[oklch(0.54_0.19_240)] text-white hover:bg-[oklch(0.48_0.19_240)] px-5',
        link: 'text-[oklch(0.54_0.19_240)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-[12px] px-3 text-[11px]',
        lg: 'h-11 rounded-[12px] px-6 text-sm font-semibold',
        icon: 'h-9 w-9 rounded-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
