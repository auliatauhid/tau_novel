import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-[#1c1d21] text-white hover:bg-[#2e2f38] dark:bg-[#eeeff2] dark:text-[#111215] dark:hover:bg-stone-200 shadow-xs hover:shadow-md',
      secondary:
        'bg-stone-100 text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700',
      outline:
        'border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700',
      ghost:
        'bg-transparent hover:bg-stone-100/80 dark:hover:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-xs hover:shadow-md',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-2',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(base, variants[variant], sizes[size], className))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
