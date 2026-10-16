'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { X, Sparkles, Terminal } from 'lucide-react';
import { EasterEggGarmentScene } from '@/scenes/EasterEggGarmentScene';
import { sound } from '@/lib/soundEngine';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl h-[75vh] bg-[#0A0D12] border border-[#00E5C7]/50 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,229,199,0.2)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05070A]/80 z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00E5C7]/10 border border-[#00E5C7]/40">
                <Sparkles className="w-4 h-4 text-[#00E5C7]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00E5C7] tracking-wider uppercase">
                    EASTER EGG UNLOCKED [3X LOGO CLICKS]
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#F0EFEA]">
                  ARANEX Topological Kinematic Wireframe
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                sound.playTick(500, 0.03);
              }}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3D Wireframe Canvas */}
          <div className="flex-1 relative bg-[#05070A]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <EasterEggGarmentScene wireframeColor="#00E5C7" wireframeOnly={true} />
            </Canvas>

            {/* Bottom HUD info */}
            <div className="absolute left-6 bottom-6 right-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pointer-events-none">
              <div className="p-3 rounded-lg bg-[#0D1117]/85 backdrop-blur-md border border-white/10 max-w-md text-xs font-mono">
                <div className="flex items-center gap-2 text-[#00E5C7] mb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>BIOMECHANICAL TOPOLOGY DECLASSIFIED</span>
                </div>
                <p className="text-white/70 text-[11px] font-sans leading-relaxed">
                  Every polygon represents a discrete knit tension vector calculated to relieve lumbar shear and optimize thoracic respiratory expansion.
                </p>
              </div>

              <div className="text-right text-[10px] font-mono text-white/40">
                <span>VERTICES: 1,482 &bull; COMPRESSION ZONES: 12 &bull; STATUS: RESEARCH PROTOTYPE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
