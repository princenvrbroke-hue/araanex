'use client';

import React, { useEffect, useRef } from 'react';

/**
 * HeroScrollSequence — scroll-linked image sequence (frame-scrub) rendered on
 * a <canvas> that exactly fills the hero's right-column stage box.
 *
 * - 213 pre-rendered orbit frames of the ARANEX mannequin + energy ribbon,
 *   shot on the same #05080f/#0a0f1a dark-navy backdrop as the site background,
 *   so the sequence blends into the page with no visible seam.
 * - The canvas is CONFINED TO THE STAGE BOX (never full-viewport): the
 *   1920×1080 source frames are only ever downscaled to fit, never expanded,
 *   so the video stays crisp.
 * - The frame index is driven by how far the user has scrolled through the
 *   pinned hero section (0 → 1), with lerp smoothing for a cinematic scrub.
 *   At rest the first frame renders statically, so the stage is never empty.
 * - Images preload in two waves (coarse pass, then fine fill) in small
 *   concurrent batches; while a frame is still loading, the nearest
 *   already-loaded frame is drawn as a fallback.
 * - Follows the project's scroll idiom (see useScrollProgress.ts): one rAF
 *   loop reads layout at high frequency into refs — scrolling never triggers
 *   a React re-render.
 */

interface HeroScrollSequenceProps {
  /** Outer (tall, pinned) hero section element driving frame progress. */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Stage box the canvas fills and is positioned relative to. */
  stageRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Refs to static-composition layers (3D ribbon, callout connectors) that
   * fade out as the orbit begins. Opacity is written directly on the DOM
   * node each frame — no React involvement.
   */
  fadeRefs: React.RefObject<HTMLElement | null>[];
}

const FRAME_COUNT = 213;
/** Frames skipped between entries of the coarse first wave. */
const COARSE_STEP = 8;
/** Lerp factor for frame scrub smoothing (per rAF ~60fps tick). */
const SCRUB_SMOOTHING = 0.16;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const frameUrl = (i: number) => `/images/sequence/frame-${String(i + 1).padStart(3, '0')}.jpg`;

export function HeroScrollSequence({ sectionRef, stageRef, fadeRefs }: HeroScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!canvas || !section || !stage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Frame cache ──────────────────────────────────────────────────────
    // Wave 1: every 8th frame (~27 images) gives a usable coarse scrub.
    // Wave 2: everything else, small concurrent batches so initial scroll
    // is never starved.
    const cache = new Map<number, HTMLImageElement>();

    const loadImage = (i: number): Promise<void> =>
      new Promise((resolve) => {
        if (cache.has(i)) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          cache.set(i, img);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(i);
      });

    const allIndices = Array.from({ length: FRAME_COUNT }, (_, i) => i);
    const coarse = allIndices.filter((i) => i % COARSE_STEP === 0);
    const fine = allIndices.filter((i) => i % COARSE_STEP !== 0);

    let cancelled = false;
    let chain: Promise<void> = Promise.resolve();
    let cursor = 0;
    const pump = () => {
      if (cancelled) return;
      // Drain the coarse wave first, then the fine fill, 8 concurrent max.
      const BATCH = 8;
      const slice = cursor < coarse.length ? coarse.slice(cursor, cursor + BATCH) : fine.slice(cursor - coarse.length, cursor - coarse.length + BATCH);
      if (!slice.length) return;
      cursor += slice.length;
      chain = chain
        .then(() => Promise.all(slice.map(loadImage)))
        .then(pump);
    };
    pump();

    // ── Scrub state (refs only — no re-renders on scroll) ────────────────
    let targetIndex = 0;      // frame implied by scroll position
    let displayIndex = 0;     // lerped, actually-drawn frame
    let lastDrawn = -1;

    const nearestLoaded = (index: number): HTMLImageElement | null => {
      if (cache.has(index)) return cache.get(index) ?? null;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (cache.has(index - d)) return cache.get(index - d) ?? null;
        if (cache.has(index + d)) return cache.get(index + d) ?? null;
      }
      return null;
    };

    // ── Canvas sizing (backing store capped at source resolution) ────────
    let cssW = 0;
    let cssH = 0;
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      if (!cssW || !cssH) return;
      // Never upscale the 1080p source into the backing store: cap device
      // pixels so no drawn frame pixel is ever stretched past native.
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
        1920 / cssW,
        1080 / cssH
      );
      canvas.width = Math.max(Math.round(cssW * dpr), 1);
      canvas.height = Math.max(Math.round(cssH * dpr), 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = -1; // force repaint
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    window.addEventListener('resize', resize);

    /** Returns false when nothing could be drawn yet (frame not loaded) */
    const draw = (index: number): boolean => {
      const img = nearestLoaded(index);
      if (!img || !img.naturalWidth || !cssW || !cssH) return false;

      const scale = Math.min(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const dx = (cssW - w) / 2;
      const dy = (cssH - h) / 2;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.drawImage(img, dx, dy, w, h);

      // Harmonize the video's backdrop with the landing page's electric blue atmosphere.
      // This infuses the studio backdrop and fiber highlights with the site's signature
      // cyan/navy glow so the video and background share the exact same palette.
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const blueGlow = ctx.createRadialGradient(
        cssW * 0.50,
        cssH * 0.40,
        40,
        cssW * 0.50,
        cssH * 0.48,
        cssW * 0.42
      );
      blueGlow.addColorStop(0, 'rgba(50, 120, 230, 0.22)');
      blueGlow.addColorStop(0.55, 'rgba(30, 80, 180, 0.12)');
      blueGlow.addColorStop(1, 'rgba(10, 25, 60, 0)');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.restore();


      // Smooth figure-hugging elliptical feathering: keeps the mannequin 100% crisp,
      // solid, and fully opaque, while dissolving the empty backdrop smoothly into the
      // landing page atmosphere so the video never pops out as a box or oval.
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.save();
      ctx.translate(cssW * 0.50, cssH * 0.52);
      const rx = cssW * 0.38;
      const ry = cssH * 0.49;
      ctx.scale(rx, ry);
      const g = ctx.createRadialGradient(0, 0, 0.40, 0, 0, 1);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.65, 'rgba(0,0,0,1)');
      g.addColorStop(0.85, 'rgba(0,0,0,0.55)');
      g.addColorStop(0.96, 'rgba(0,0,0,0.10)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = prev;
      return true;
    };

    const setFade = (el: HTMLElement | null, v: number) => {
      if (el) {
        el.style.opacity = String(v);
        el.style.pointerEvents = v < 0.02 ? 'none' : '';
      }
    };

    // ── Main rAF loop (paused while the hero is off-screen) ──────────────
    let visible = true;
    let rafId = 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !rafId && !cancelled) rafId = requestAnimationFrame(tick);
    });
    io.observe(section);

    const tick = () => {
      rafId = 0;
      if (cancelled || !visible) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = Math.max(rect.height - vh, 1);
      const progress = clamp(-rect.top / range, 0, 1);

      // Fade the static-composition overlays once the orbit starts.
      const overlayOpacity = 1 - clamp((progress - 0.01) / 0.05, 0, 1);
      for (let i = 0; i < fadeRefs.length; i++) {
        setFade(fadeRefs[i]?.current ?? null, overlayOpacity);
      }

      targetIndex = progress * (FRAME_COUNT - 1);
      if (reducedMotion) {
        displayIndex = targetIndex;
      } else {
        displayIndex += (targetIndex - displayIndex) * SCRUB_SMOOTHING;
        if (Math.abs(targetIndex - displayIndex) < 0.002) displayIndex = targetIndex;
      }

      const idx = clamp(Math.round(displayIndex), 0, FRAME_COUNT - 1);
      // Only mark a frame drawn once it actually painted, so the first frame
      // appears as soon as it loads instead of waiting for a scroll.
      if (idx !== lastDrawn && draw(idx) && cache.has(idx)) {
        lastDrawn = idx;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [sectionRef, stageRef, fadeRefs]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{
          filter: 'contrast(1.06) brightness(0.94) saturate(1.12)',
        }}
      />
    </div>
  );
}
