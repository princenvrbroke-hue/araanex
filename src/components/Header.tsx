'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SoundToggle } from './SoundToggle';
import { Dialog } from './ui/Dialog';
import { sound } from '@/lib/soundEngine';

interface HeaderProps {
  activeSection: number;
  onSelectSection: (index: number) => void;
  onOpenResearch?: () => void;
  /** Fired on three quick clicks of the wordmark */
  onSecret?: () => void;
}

type NavItem = { label: string; section: number; action?: 'research' };

const NAV_ITEMS: NavItem[] = [
  { label: 'Our Story', section: 0 },
  { label: 'Evolution of Clothing', section: 1 },
  { label: 'The Science', section: 2 },
  { label: 'Our Innovations', section: 3 },
  { label: 'Future of Wearables', section: 4 },
  { label: 'Research & Insights', section: 5, action: 'research' },
  { label: 'Explore Products', section: 3 },
];

export function Header({ activeSection, onSelectSection, onOpenResearch, onSecret }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoClicks = useRef<number[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (item: NavItem) => {
    sound.playTick(500, 0.02);
    setMenuOpen(false);
    if (item.action === 'research' && onOpenResearch) onOpenResearch();
    else onSelectSection(item.section);
  };

  // Only the first item for a section shows as current (two links share §3)
  const isCurrent = (item: NavItem) =>
    !item.action && NAV_ITEMS.find((n) => !n.action && n.section === activeSection) === item;

  const handleLogo = () => {
    const now = performance.now();
    logoClicks.current = [...logoClicks.current.filter((t) => now - t < 800), now];
    if (logoClicks.current.length >= 3) {
      logoClicks.current = [];
      onSecret?.();
      return;
    }
    sound.playTick(600, 0.03);
    onSelectSection(0);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[84px] transition-all duration-500 flex items-center px-6 md:px-12 ${
          isScrolled
            ? 'bg-[#05080f]/80 backdrop-blur-[12px] border-b border-[rgba(160,190,255,0.12)] shadow-[0_10px_30px_rgba(5,8,15,0.8)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={handleLogo}
            className="text-left cursor-pointer"
            aria-label="ARANEX, back to top"
          >
            <span className="text-[24px] md:text-[28px] font-normal tracking-[0.4em] text-white uppercase select-none transition-opacity duration-300 hover:opacity-85">
              ARANEX
            </span>
          </button>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-[clamp(20px,2.4vw,44px)]">
              {NAV_ITEMS.map((item) => {
                const active = isCurrent(item);
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleNav(item)}
                      aria-current={active ? 'location' : undefined}
                      aria-haspopup={item.action === 'research' ? 'dialog' : undefined}
                      className={`relative py-1 text-[13px] font-normal whitespace-nowrap transition-colors cursor-pointer ${
                        active ? 'text-white' : 'text-[#c9d3e6] hover:text-white'
                      }`}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-gradient-to-r from-[#8cc4ff] to-[#5aa9ff] shadow-[0_0_8px_rgba(140,196,255,0.6)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <SoundToggle />
            <button
              type="button"
              onClick={() => {
                sound.playTick(700, 0.02);
                setMenuOpen(true);
              }}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="w-[36px] h-[36px] flex flex-col justify-center items-end gap-[7px] cursor-pointer group p-1"
            >
              <span className="w-[28px] h-[1.5px] bg-white transition-all duration-300 group-hover:bg-[#8cc4ff]" />
              <span className="w-[28px] h-[1.5px] bg-white transition-all duration-300 group-hover:bg-[#8cc4ff]" />
            </button>
          </div>
        </div>
      </header>

      <Dialog
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menu"
        heading={<span className="tracking-[0.4em] uppercase">ARANEX</span>}
        fullscreen
        className="p-8 md:p-14 flex flex-col"
      >
        <nav aria-label="Main" className="my-auto py-10">
          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map((item, idx) => (
              <li key={item.label}>
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  onClick={() => handleNav(item)}
                  aria-current={isCurrent(item) ? 'location' : undefined}
                  className={`w-full text-left text-2xl md:text-3xl font-light transition-colors flex items-center justify-between group cursor-pointer ${
                    isCurrent(item) ? 'text-white' : 'text-[#c9d3e6] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-[#8cc4ff] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    0{idx + 1}
                  </span>
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pt-6 border-t border-[rgba(160,190,255,0.18)] flex items-center justify-between text-xs text-[#7f8ba3]">
          <span>© ARANEX Biomechanical Wearables</span>
          <span>The Science of Wearables</span>
        </div>
      </Dialog>
    </>
  );
}
