import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx('animate-shimmer rounded-xl bg-stone-200/70 dark:bg-stone-800/60', className)
      )}
      {...props}
    />
  );
}
