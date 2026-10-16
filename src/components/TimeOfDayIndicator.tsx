'use client';

import React, { useState } from 'react';
import { Sun, Moon, Sunrise, Sunset, Clock } from 'lucide-react';
import { TimeMode, LIGHTING_PRESETS } from '@/hooks/useTimeOfDay';

interface TimeOfDayIndicatorProps {
  mode: TimeMode;
  activeKey: 'dawn' | 'day' | 'dusk' | 'night';
  currentHour: number;
  onSelectMode: (mode: TimeMode) => void;
}

export function TimeOfDayIndicator({
  mode,
  activeKey,
  currentHour,
  onSelectMode,
}: TimeOfDayIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.floor((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const icons = {
    dawn: Sunrise,
    day: Sun,
    dusk: Sunset,
    night: Moon,
  };
  const ActiveIcon = icons[activeKey];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-white/20 text-xs font-mono text-white/70 hover:text-white transition-all"
        title="Dynamic Time-of-Day Lighting System"
        aria-expanded={isOpen}
      >
        <ActiveIcon className="w-3.5 h-3.5 text-[#00E5C7]" />
        <span className="hidden md:inline uppercase">{LIGHTING_PRESETS[activeKey].name}</span>
        <span className="text-[10px] text-white/40">({formatTime(currentHour)})</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl border border-white/15 bg-[#0D1117]/95 backdrop-blur-md shadow-2xl z-50 text-xs font-sans">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-mono text-[10px] tracking-wider text-white/50 uppercase">
                LIGHTING CALIBRATION
              </span>
              <span className="text-[10px] font-mono text-[#00E5C7]">
                LOCAL {formatTime(currentHour)}
              </span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectMode('auto');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  mode === 'auto'
                    ? 'bg-[#00E5C7]/15 text-[#00E5C7] border border-[#00E5C7]/30'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Auto (Local Time)</span>
                </span>
                <span className="text-[10px] font-mono capitalize">{activeKey}</span>
              </button>

              {(['dawn', 'day', 'dusk', 'night'] as const).map((key) => {
                const Icon = icons[key];
                const preset = LIGHTING_PRESETS[key];
                const isSelected = mode === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectMode(key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-[#00E5C7]/15 text-[#00E5C7] border border-[#00E5C7]/30'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{key}</span>
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {preset.hourLabel}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-white/40 leading-relaxed border-t border-white/10 pt-2">
              {LIGHTING_PRESETS[activeKey].description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
