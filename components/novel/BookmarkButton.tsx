'use client';

import { useState, useTransition } from 'react';
import { Bookmark } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface BookmarkButtonProps {
  novelId: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({ novelId, initialBookmarked = false }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();

  const handleToggle = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // Optimistic toggle
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    startTransition(async () => {
      try {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ novelId }),
        });

        if (!res.ok) {
          // Revert on error
          setIsBookmarked(!nextState);
        } else {
          const data = await res.json();
          setIsBookmarked(data.bookmarked);
        }
      } catch {
        setIsBookmarked(!nextState);
      }
    });
  };

  return (
    <Button
      variant={isBookmarked ? 'primary' : 'outline'}
      size="md"
      onClick={handleToggle}
      disabled={isPending}
      className={`h-12 px-5 text-sm font-semibold rounded-xl transition-all duration-200 ${
        isBookmarked
          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs border-amber-600'
          : 'border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-850'
      }`}
    >
      <Bookmark
        className={`h-4 w-4 transition-transform duration-200 ${
          isBookmarked ? 'fill-current scale-110' : 'scale-100'
        }`}
      />
      <span>{isBookmarked ? 'Tersimpan di Library' : 'Simpan ke Bookmark'}</span>
    </Button>
  );
}
