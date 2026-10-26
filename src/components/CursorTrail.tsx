'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  born: number;
  /** True when the cursor paused before this point: the line must not bridge the gap */
  breakBefore: boolean;
}

const LIFETIME = 650; // ms a thread segment stays visible
const MAX_POINTS = 60;
const BREAK_GAP = 120; // ms of stillness that starts a new thread

/**
 * Cursor Light Thread Trail
 * - points are time-aged and drawn as smooth quadratic curves (no jagged polylines)
 * - stillness breaks the thread, so old points never get linked to new movement
 * - RAF loop pauses completely when the trail is empty
 * - disabled on touch devices and for reduced-motion users
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Canvas stays inert (and empty) on touch devices and for reduced motion
    if (!finePointer.matches || reducedMotion.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = Math.floor(window.innerWidth * dpr));
    let height = (canvas.height = Math.floor(window.innerHeight * dpr));
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * nextDpr);
      canvas.height = Math.floor(height * nextDpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(nextDpr, nextDpr);
    };
    window.addEventListener('resize', handleResize);

    const points: Point[] = [];
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let hasLast = false;
    let running = false;
    let animationFrameId = 0;

    const start = () => {
      if (!running) {
        running = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;

      if (hasLast && Math.hypot(x - lastX, y - lastY) < 3) return;

      const breakBefore = !hasLast || now - lastT > BREAK_GAP;
      // Light ease toward the pointer keeps the thread silky instead of jittery
      const px = breakBefore ? x : lastX + (x - lastX) * 0.6;
      const py = breakBefore ? y : lastY + (y - lastY) * 0.6;

      points.push({ x: px, y: py, born: now, breakBefore });
      if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);

      lastX = px;
      lastY = py;
      lastT = now;
      hasLast = true;
      start();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const mid = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

    const strokePass = (rgb: string, alphaMax: number, widthAt: (fade: number) => number, now: number) => {
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const cur = points[i];
        const next = points[i + 1];
        if (cur.breakBefore || next.breakBefore) continue;

        const fade = 1 - (now - cur.born) / LIFETIME;
        if (fade <= 0) continue;

        const m0 = mid(prev, cur);
        const m1 = mid(cur, next);
        ctx.beginPath();
        ctx.moveTo(m0.x, m0.y);
        ctx.quadraticCurveTo(cur.x, cur.y, m1.x, m1.y);
        ctx.strokeStyle = `rgba(${rgb}, ${fade * alphaMax})`;
        ctx.lineWidth = widthAt(fade);
        ctx.stroke();
      }
    };

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      while (points.length > 0 && now - points[0].born >= LIFETIME) points.shift();

      if (points.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = 'lighter';

        // Wide soft halo, mid glow, thin bright core (cheap layered glow, no shadowBlur)
        strokePass('60, 140, 255', 0.12, (f) => 2 + f * 9, now);
        strokePass('90, 169, 255', 0.3, (f) => 1 + f * 4, now);
        strokePass('225, 240, 255', 0.9, (f) => 0.5 + f * 1.4, now);

        // Glowing head at the newest point
        const head = points[points.length - 1];
        const headFade = 1 - (now - head.born) / LIFETIME;
        if (headFade > 0) {
          const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
          g.addColorStop(0, `rgba(210, 232, 255, ${0.7 * headFade})`);
          g.addColorStop(1, 'rgba(90, 169, 255, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (points.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        running = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-500"
      aria-hidden="true"
    />
  );
}
