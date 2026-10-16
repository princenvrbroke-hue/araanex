'use client';

import React from 'react';
import { motion } from 'framer-motion';

const CHAPTERS = [
  { num: '01', id: 'section-1', name: 'The Origin' },
  { num: '02', id: 'section-2', name: 'Clothing & Performance' },
  { num: '03', id: 'section-3', name: 'The Polo Shirt' },
  { num: '04', id: 'section-4', name: 'Science of What We Wear' },
  { num: '05', id: 'section-5', name: 'The ARANEX Approach' },
  { num: '06', id: 'section-6', name: 'Beyond Comfort' },
  { num: '07', id: 'section-7', name: 'The Future' },
  { num: '08', id: 'section-8', name: 'Our Vision' },
];

interface ChapterRailProps {
  activeSection: number;
  onSelect: (index: number) => void;
}

export function ChapterRail({ activeSection, onSelect }: ChapterRailProps) {
  return (
    <nav
      aria-label="Chapter progress navigation"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-start gap-4 select-none"
    >
      {/* Vertical spine line */}
      <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-white/10 -z-10" />

      {CHAPTERS.map((ch, idx) => {
        const chapterIdx = idx + 1;
        const isActive = activeSection === chapterIdx;
        const isPast = activeSection > chapterIdx;

        return (
          <button
            key={ch.num}
            onClick={() => onSelect(chapterIdx)}
            className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5C7]"
            aria-label={`Jump to Chapter ${ch.num}: ${ch.name}`}
            aria-current={isActive ? 'step' : undefined}
          >
            {/* Dot indicator */}
            <div
              className={`relative flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 ${
                isActive
                  ? 'border-[#00E5C7] bg-[#00E5C7]/10 shadow-[0_0_12px_rgba(0,229,199,0.5)]'
                  : isPast
                  ? 'border-white/40 bg-white/10'
                  : 'border-white/20 bg-[#05070A]/80 hover:border-white/50'
              }`}
            >
              <span
                className={`font-mono text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-[#00E5C7]' : isPast ? 'text-white/80' : 'text-white/40'
                }`}
              >
                {ch.num}
              </span>

              {/* Active glow ping */}
              {isActive && (
                <motion.span
                  layoutId="rail-glow"
                  className="absolute inset-0 rounded-full border border-[#00E5C7] animate-ping opacity-30"
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Chapter name tooltip label */}
            <span
              className={`text-xs font-sans tracking-wide transition-all duration-300 ${
                isActive
                  ? 'text-white font-medium opacity-100 translate-x-0'
                  : 'text-white/40 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0'
              }`}
            >
              {ch.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
