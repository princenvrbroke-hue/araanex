'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { sound } from '@/lib/soundEngine';
import { CHAPTERS } from '@/content/site';

/**
 * Module-level store for HIGH-FREQUENCY scroll data.
 * Written on every Lenis scroll event, read inside rAF / R3F callbacks —
 * deliberately NOT React state, so scrolling never triggers a re-render.
 */
export const globalScroll = {
  progress: 0, //  0 -> 1 overall page scroll
  velocity: 0, //  scroll speed
};

let activeLenis: Lenis | null = null;

/** Pause/resume page scrolling (used while a dialog is open). */
export function setPageScrollLocked(locked: boolean) {
  if (activeLenis) {
    if (locked) activeLenis.stop();
    else activeLenis.start();
  } else {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }
}

export function useScrollProgress() {
  const [activeSection, setActiveSection] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reducedRef.current = reduced;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reduced,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    activeLenis = lenis;

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      globalScroll.progress = Math.max(0, Math.min(1, e.progress || 0));
      globalScroll.velocity = Math.abs(e.velocity || 0);
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Active chapter = the section crossing the middle of the viewport.
    // Sections have very different heights (the hero is pinned for ~3
    // screens), so this is measured from the DOM, not from overall progress.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.id.replace('section-', ''));
            if (!Number.isNaN(idx)) setActiveSection(idx);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    for (const ch of CHAPTERS) {
      const el = document.getElementById(`section-${ch.index}`);
      if (el) io.observe(el);
    }

    // Dev-only deep link for screenshots: ?sec=N
    let deepLinkTimer: number | undefined;
    if (process.env.NODE_ENV !== 'production') {
      const sec = Number.parseInt(new URLSearchParams(window.location.search).get('sec') ?? '', 10);
      if (!Number.isNaN(sec)) {
        deepLinkTimer = window.setTimeout(() => {
          const el = document.getElementById(`section-${sec}`);
          if (el) lenis.scrollTo(el, { immediate: true });
        }, 80);
      }
    }

    return () => {
      window.clearTimeout(deepLinkTimer);
      io.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);

  const scrollToSection = useCallback((sectionIndex: number) => {
    const el = document.getElementById(`section-${sectionIndex}`);
    if (!el) return;
    sound.playTick(600, 0.03);
    const lenis = lenisRef.current;
    const immediate = reducedRef.current;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.6, immediate });
    } else {
      el.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
    }
    // Move keyboard focus with the scroll so Tab continues from the chapter
    el.focus({ preventScroll: true });
  }, []);

  return { activeSection, scrollToSection };
}
