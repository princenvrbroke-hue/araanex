'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/soundEngine';

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  const toggleSound = () => {
    const next = !enabled;
    setEnabled(next);
    sound.setEnabled(next);
  };

  return (
    <button
      onClick={toggleSound}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono tracking-wider transition-all duration-300 ${
        enabled
          ? 'border-[#00E5C7]/50 bg-[#00E5C7]/10 text-[#00E5C7] shadow-[0_0_12px_rgba(0,229,199,0.25)]'
          : 'border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20'
      }`}
      aria-label={enabled ? 'Disable ambient sound design' : 'Enable ambient sound design'}
      title={enabled ? 'Sound Design: Active (Procedural Web Audio)' : 'Sound Design: Muted'}
    >
      {enabled ? (
        <Volume2 className="w-3.5 h-3.5 text-[#00E5C7] animate-pulse" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70" />
      )}
      <span className="hidden sm:inline">
        {enabled ? 'AUDIO ON' : 'AUDIO OFF'}
      </span>
      {enabled && (
        <span className="flex items-center gap-0.5 ml-1">
          <span className="w-0.5 h-2 bg-[#00E5C7] animate-[pulse_0.8s_ease-in-out_infinite]" />
          <span className="w-0.5 h-3 bg-[#00E5C7] animate-[pulse_0.6s_ease-in-out_infinite_0.1s]" />
          <span className="w-0.5 h-1.5 bg-[#00E5C7] animate-[pulse_0.9s_ease-in-out_infinite_0.2s]" />
        </span>
      )}
    </button>
  );
}
