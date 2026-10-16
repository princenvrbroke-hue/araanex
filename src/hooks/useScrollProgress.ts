'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '@/lib/soundEngine';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollState {
  progress: number;        // Overall page scroll progress 0 -> 1
  activeSection: number;   // 0 -> 8
  velocity: number;        // Scroll speed / inertia for fabric deformation
  isExhaling: boolean;     // True when reached footer (Surprise #6)
  lenis: Lenis | null;
}

// Global store to share scroll progress without heavy re-renders
export const globalScroll = {
  progress: 0,
  velocity: 0,
  activeSection: 0,
  isExhaling: false,
  targetSection: 0,
};

export function useScrollProgress() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    activeSection: 0,
    velocity: 0,
    isExhaling: false,
    lenis: null,
  });

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      ScrollTrigger.update();
      const prog = Math.max(0, Math.min(1, e.progress || 0));
      const vel = Math.abs(e.velocity || 0);

      globalScroll.progress = prog;
      globalScroll.velocity = vel;

      // Section calculation (8 chapters + hero: 0 to 8)
      const rawSec = Math.floor(prog * 8.99);
      globalScroll.activeSection = rawSec;

      // Check footer exhale trigger (> 0.985)
      const isEnd = prog > 0.982;
      if (isEnd && !globalScroll.isExhaling) {
        globalScroll.isExhaling = true;
        sound.playExhale();
      } else if (!isEnd && globalScroll.isExhaling) {
        globalScroll.isExhaling = false;
      }

      // Subtle fabric rustle during fast scrolls
      if (vel > 4.5 && Math.random() < 0.08) {
        sound.playFabricRustle(0.2, 0.06);
      }

      setScrollState((prev) => ({
        ...prev,
        progress: prog,
        activeSection: rawSec,
        velocity: vel,
        isExhaling: globalScroll.isExhaling,
      }));
    });

    function updateRaf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(updateRaf);
    }
    const rafId = requestAnimationFrame(updateRaf);

    // Synchronize Lenis with GSAP ScrollTrigger
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    setScrollState((prev) => ({ ...prev, lenis }));

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    if (!scrollState.lenis) {
      const el = document.getElementById(`section-${sectionIndex}`);
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`section-${sectionIndex}`);
    if (el) {
      sound.playTick(600, 0.03);
      scrollState.lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    }
  };

  return {
    ...scrollState,
    scrollToSection,
  };
}
