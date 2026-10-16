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

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const points: Point[] = [];
    let mouse = { x: -100, y: -100, prevX: -100, prevY: -100 };
    let isMoving = false;
    let stopTimeout: NodeJS.Timeout;

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
      }

      isMoving = true;
      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        isMoving = false;
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw weaving thread
      if (points.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];

          const progress = p1.life / p1.maxLife;
          const alpha = Math.max(0, 1 - progress);

          // Electric cyan gradient transitioning to translucent bone white
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);

          // Weave thread glow
          ctx.strokeStyle = `rgba(0, 229, 199, ${alpha * 0.65})`;
          ctx.lineWidth = Math.max(0.5, (1 - progress) * 2.2);
          ctx.shadowColor = 'rgba(0, 229, 199, 0.8)';
          ctx.shadowBlur = 6;
          ctx.stroke();

          // Core bright white strand
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(240, 239, 234, ${alpha * 0.85})`;
          ctx.lineWidth = Math.max(0.3, (1 - progress) * 1.0);
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Age points and remove dead ones
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          points.splice(i, 1);
        }
      }

      // Cap points array to maintain performance
      if (points.length > 90) {
        points.splice(0, points.length - 90);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

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
