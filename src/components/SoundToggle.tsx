'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/soundEngine';

const STORAGE_KEY = 'aranex_audio_enabled';
const CHANGE_EVENT = 'aranex-audio-change';

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function SoundToggle() {
  const enabled = useSyncExternalStore(subscribe, readStored, () => false);

  useEffect(() => {
    sound.setEnabled(enabled);
  }, [enabled]);

  const toggleSound = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(!enabled));
    } catch {
      // Ignore storage write errors; the toggle just won't persist
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={enabled}
      aria-label="Ambient sound"
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs tracking-wider transition-all duration-300 cursor-pointer ${
        enabled
          ? 'border-[#5aa9ff]/60 bg-[#5aa9ff]/15 text-[#8cc4ff] shadow-[0_0_16px_rgba(90,169,255,0.4)]'
          : 'border-white/10 bg-white/5 text-white/60 hover:text-white/85 hover:border-white/20'
      }`}
    >
      {enabled ? (
        <Volume2 className="w-3.5 h-3.5 text-[#8cc4ff]" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-white/50 group-hover:text-white/75" />
      )}
      <span className="hidden sm:inline">{enabled ? 'Audio on' : 'Audio off'}</span>
    </button>
  );
}
