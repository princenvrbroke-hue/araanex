'use client';

import React from 'react';

const CHAPTERS = [
  { num: '01', name: 'The Science of Wearables', index: 0 },
  { num: '02', name: 'The Evolution Timeline', index: 1 },
  { num: '03', name: 'Explore the Human Body', index: 2 },
  { num: '04', name: 'Engineered Materials', index: 3 },
  { num: '05', name: 'The Future of Wearables', index: 4 },
  { num: '06', name: 'Our Vision', index: 5 },
];

interface ChapterRailProps {
  activeSection: number;
  onSelect: (index: number) => void;
}

export function ChapterRail({ activeSection, onSelect }: ChapterRailProps) {
  return (
    <nav
      aria-label="Chapters"
      className="fixed left-[20px] top-1/2 -translate-y-1/2 z-30 hidden xl:block select-none"
    >
      {/* Vertical spine line */}
      <div aria-hidden="true" className="absolute left-[13.5px] top-3 bottom-3 w-[1px] bg-[rgba(160,190,255,0.18)] -z-10" />

      <ol className="flex flex-col items-start gap-3.5">
        {CHAPTERS.map((ch) => {
          const isActive = activeSection === ch.index;
          const isPast = activeSection > ch.index;

          return (
            <li key={ch.num}>
              <button
                type="button"
                onClick={() => onSelect(ch.index)}
                className="group flex items-center gap-3 text-left cursor-pointer rounded-full"
                aria-label={`Chapter ${ch.num}: ${ch.name}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  className={`relative flex items-center justify-center w-[28px] h-[28px] rounded-full border transition-all duration-300 ${
                    isActive
                      ? 'border-[#5aa9ff] bg-[#5aa9ff]/25 shadow-[0_0_15px_rgba(90,169,255,0.6)] scale-105'
                      : isPast
                      ? 'border-[#5aa9ff]/40 bg-[#0d1422]/80'
                      : 'border-[rgba(160,190,255,0.2)] bg-[#05080f]/90 group-hover:border-[#8cc4ff]/60'
                  }`}
                >
                  <span
                    className={`text-[10px] font-medium transition-colors tabular-nums ${
                      isActive ? 'text-[#8cc4ff]' : isPast ? 'text-white' : 'text-[#7f8ba3]'
                    }`}
                  >
                    {ch.num}
                  </span>
                </span>

                {/* Hover / keyboard-focus label */}
                <span
                  aria-hidden="true"
                  className={`text-[11px] font-medium tracking-wider uppercase whitespace-nowrap transition-all duration-300 pointer-events-none opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 ${
                    isActive ? 'text-[#8cc4ff]' : 'text-[#c9d3e6]'
                  }`}
                >
                  {ch.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
