'use client';

import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { SoundToggle } from './SoundToggle';
import { TimeOfDayIndicator } from './TimeOfDayIndicator';
import { TimeMode } from '@/hooks/useTimeOfDay';
import { sound } from '@/lib/soundEngine';

interface NavigationProps {
  timeMode: TimeMode;
  activeTimeKey: 'dawn' | 'day' | 'dusk' | 'night';
  currentHour: number;
  onSelectTimeMode: (mode: TimeMode) => void;
  onSelectSection: (index: number) => void;
  onOpenEasterEgg: () => void;
  onOpenEmailModal: () => void;
}

const NAV_ITEMS = [
  { label: 'Our Story', sectionIndex: 0 },
  { label: 'Evolution of Clothing', sectionIndex: 1 },
  { label: 'The Science', sectionIndex: 4 },
  { label: 'Our Innovations', sectionIndex: 5 },
  { label: 'Future of Wearables', sectionIndex: 7 },
  { label: 'Research & Insights', sectionIndex: 8 },
];

export function Navigation({
  timeMode,
  activeTimeKey,
  currentHour,
  onSelectTimeMode,
  onSelectSection,
  onOpenEasterEgg,
  onOpenEmailModal,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Easter egg: 3 clicks within 2 seconds
  const handleLogoClick = () => {
    sound.playTick(800, 0.02);
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 3) {
      sound.playDataPulse();
      onOpenEasterEgg();
      setClickCount(0);
    } else {
      setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 transition-all duration-300">
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl bg-[#05070A]/75 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Brand Logo with Triple-Click Easter Egg */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            className="group flex items-center gap-2 text-left focus:outline-none cursor-pointer"
            title="Click 3 times to inspect wireframe topology"
            aria-label="ARANEX brandmark (Click 3 times for Easter Egg)"
          >
            <div className="relative w-7 h-7 rounded-lg bg-[#00E5C7]/15 border border-[#00E5C7]/40 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-serif font-bold text-sm text-[#00E5C7]">A</span>
              {clickCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5C7] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5C7] text-[8px] text-black font-mono font-bold items-center justify-center">
                    {clickCount}
                  </span>
                </span>
              )}
            </div>
            <div>
              <span className="font-serif text-lg tracking-[0.2em] font-light text-[#F0EFEA] uppercase">
                ARANEX
              </span>
              <span className="hidden sm:block text-[8px] font-mono tracking-widest text-[#00E5C7] uppercase -mt-1">
                BIO-WEARABLE LABS
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-6 text-xs font-sans tracking-wide text-white/70">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                sound.playTick(500, 0.02);
                onSelectSection(item.sectionIndex);
              }}
              className="hover:text-white transition-colors cursor-pointer py-1"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Action Tools: Time-of-Day, Sound, CTA */}
        <div className="flex items-center gap-2.5">
          <TimeOfDayIndicator
            mode={timeMode}
            activeKey={activeTimeKey}
            currentHour={currentHour}
            onSelectMode={onSelectTimeMode}
          />

          <SoundToggle />

          <button
            onClick={onOpenEmailModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00E5C7] hover:bg-[#56FFDD] text-[#05070A] text-xs font-mono font-semibold tracking-wider transition-all shadow-[0_0_12px_rgba(0,229,199,0.25)]"
          >
            <span>JOIN LAB</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-white/10 text-white/70 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-2 p-5 rounded-2xl bg-[#0D1117]/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4">
          <div className="space-y-2 text-sm font-sans">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onSelectSection(item.sectionIndex);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenEmailModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#00E5C7] text-[#05070A] text-xs font-mono font-semibold text-center"
            >
              JOIN RESEARCH JOURNEY
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
