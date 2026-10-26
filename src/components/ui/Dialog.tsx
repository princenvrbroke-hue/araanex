'use client';

import React, { ReactNode, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { setPageScrollLocked } from '@/hooks/useScrollProgress';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Visually rendered heading; defaults to `title` */
  heading?: ReactNode;
  /** Small line above the heading */
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Full-screen sheet (mobile menu) instead of a centred panel */
  fullscreen?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: role="dialog", labelled, Escape to close, focus trapped
 * inside and restored to the opener on close, page scroll paused.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  heading,
  eyebrow,
  children,
  className = '',
  fullscreen = false,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    setPageScrollLocked(true);

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      setPageScrollLocked(false);
      opener?.focus?.();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed inset-0 z-50 flex ${
            fullscreen
              ? 'bg-[#05080f]/95 backdrop-blur-[24px]'
              : 'items-center justify-center p-4 bg-[#05080f]/80 backdrop-blur-md'
          }`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-lenis-prevent
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: fullscreen ? 1 : 0.96, y: fullscreen ? 0 : 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: fullscreen ? 1 : 0.96, y: fullscreen ? 0 : 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={
              fullscreen
                ? `relative w-full h-full overflow-y-auto ${className}`
                : `relative w-full max-h-[90svh] overflow-y-auto rounded-2xl border border-[rgba(160,190,255,0.25)] bg-[#0a0f1a]/95 shadow-[0_20px_60px_rgba(5,8,15,0.9),0_0_40px_rgba(70,150,255,0.15)] ${className}`
            }
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                {eyebrow}
                <h2 id={titleId} className={`text-[24px] md:text-[28px] font-normal text-white leading-tight ${eyebrow ? 'mt-2' : ''}`}>
                  {heading ?? title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
