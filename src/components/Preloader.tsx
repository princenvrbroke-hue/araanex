'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Simulate resource & shader compilation progress
      const increment = Math.max(1, Math.floor(Math.random() * 8));
      current = Math.min(100, current + increment);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          onComplete?.();
        }, 400);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070A] text-[#F0EFEA]"
        >
          {/* Subtle laboratory ambient background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,199,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* 3D Thread Weaving Animation SVG */}
          <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5C7" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#00E5C7" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background circular guide ring */}
              <circle
                cx="100"
                cy="100"
                r="72"
                stroke="#161B22"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />

              {/* Horizontal warp yarns */}
              {[60, 80, 100, 120, 140].map((y, i) => (
                <motion.line
                  key={`warp-${i}`}
                  x1="45"
                  y1={y}
                  x2="155"
                  y2={y}
                  stroke="#1F2937"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.2 }}
                />
              ))}

              {/* Vertical weft yarns */}
              {[60, 80, 100, 120, 140].map((x, i) => (
                <motion.line
                  key={`weft-${i}`}
                  x1={x}
                  y1="45"
                  x2={x}
                  y2="155"
                  stroke="#1F2937"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.2 }}
                />
              ))}

              {/* Glowing active thread weaving over and under */}
              <motion.path
                d="M 50,100 C 70,60 90,140 100,100 C 110,60 130,140 150,100 C 160,80 140,50 100,50 C 60,50 40,90 60,130 C 80,160 120,160 140,130"
                stroke="url(#threadGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ ease: "easeInOut" }}
              />

              {/* Pulsing leading spark */}
              <circle
                cx="100"
                cy="100"
                r="3"
                fill="#00E5C7"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>

            {/* Percentage Display in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-light tracking-wider text-[#F0EFEA]">
                {progress}
                <span className="text-xs text-[#00E5C7] ml-0.5">%</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#8B949E] mt-1 font-mono">
                SYNTHESIZING
              </span>
            </div>
          </div>

          {/* Brand & Status metadata */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-xl tracking-[0.3em] font-light text-[#F0EFEA] uppercase">
              ARANEX
            </h1>
            <p className="text-xs font-mono text-[#8B949E] tracking-wider">
              INITIALIZING BIOMECHANICAL SHADERS &bull; DRIVER CALIBRATION
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
