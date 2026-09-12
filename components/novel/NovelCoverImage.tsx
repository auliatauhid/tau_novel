'use client';

import { useState, useEffect } from 'react';
import { Book } from 'lucide-react';

interface NovelCoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackTitle?: string;
  fallbackIcon?: React.ReactNode;
  loading?: 'lazy' | 'eager';
}

export function NovelCoverImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackClassName,
  fallbackTitle,
  fallbackIcon,
  loading = 'lazy',
}: NovelCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error status if source changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const defaultFallbackClass =
    fallbackClassName ||
    'w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 dark:from-stone-900 dark:via-stone-850 dark:to-stone-950 text-stone-600 dark:text-stone-300';

  if (!src || hasError) {
    return (
      <div className={defaultFallbackClass}>
        {fallbackIcon || <Book className="h-8 w-8 mb-2 opacity-50 text-amber-700/70 dark:text-amber-500/60 shrink-0" />}
        {fallbackTitle && (
          <span className="text-xs font-serif font-bold line-clamp-3 px-1 leading-snug">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      loading={loading}
      className={className}
    />
  );
}
