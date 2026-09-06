import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          clsx(
            'flex h-10 w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-600 dark:focus-visible:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 shadow-2xs',
            className
          )
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
