'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            title="Tutup (Esc)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
