import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/90 shadow-xs backdrop-blur-xs transition-all',
          className
        )
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge(clsx('flex flex-col space-y-1.5 p-6 pb-4', className))} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(
        clsx('font-bold text-lg sm:text-xl leading-snug tracking-tight text-stone-900 dark:text-stone-50', className)
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge(clsx('text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed', className))}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge(clsx('p-6 pt-0', className))} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge(clsx('flex items-center p-6 pt-0', className))} {...props} />;
}
