'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/**
 * Cursor Light Thread Trail (Surprise #1)
 * Perf-forward rewrite:
 * - RAF loop pauses completely when the trail is empty & idle
 * - glow drawn as layered strokes (far cheaper than per-segment shadowBlur)
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
    const mouse = { x: -100, y: -100, prevX: -100, prevY: -100 };
    let running = false;
    let animationFrameId = 0;
    let stopTimeout: ReturnType<typeof setTimeout>;

    const start = () => {
      if (!running) {
        running = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 2 && mouse.prevX > 0) {
        // Emit thread segment with organic weave oscillation
        const angle = Math.atan2(dy, dx);
        const perp = angle + Math.PI / 2;
        const wobble = Math.sin(Date.now() * 0.015) * 3;

        points.push({
          x: mouse.x + Math.cos(perp) * wobble,
          y: mouse.y + Math.sin(perp) * wobble,
          vx: Math.cos(perp) * (Math.random() - 0.5) * 0.6,
          vy: Math.sin(perp) * (Math.random() - 0.5) * 0.6,
          life: 0,
          maxLife: 35 + Math.random() * 20,
        });

        if (points.length > 90) {
          points.splice(0, points.length - 90);
        }
        start();
      }

      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(start, 150);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          points.splice(i, 1);
        }
      }

      if (points.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = 'lighter';

        // Pass 1: soft glow strokes (replaces costly shadowBlur)
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const progress = p1.life / p1.maxLife;
          const alpha = Math.max(0, 1 - progress);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(0, 229, 199, ${alpha * 0.22})`;
          ctx.lineWidth = Math.max(1, (1 - progress) * 6);
          ctx.stroke();
        }

        // Pass 2: bright core strand
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const progress = p1.life / p1.maxLife;
          const alpha = Math.max(0, 1 - progress);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(240, 239, 234, ${alpha * 0.85})`;
          ctx.lineWidth = Math.max(0.4, (1 - progress) * 1.4);
          ctx.stroke();
        }

        ctx.restore();
      }

      if (points.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Fully idle: stop consuming CPU/GPU
        running = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(stopTimeout);
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
