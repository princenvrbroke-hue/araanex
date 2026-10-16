'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Layers, Activity } from 'lucide-react';
import { sound } from '@/lib/soundEngine';
import { Canvas } from '@react-three/fiber';
import { MacroWeaveCanvas } from '@/scenes/MacroWeaveModalScene';

export function MacroFabricSwatch() {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFibreLayer, setActiveFibreLayer] = useState<'all' | 'capillary' | 'elastomer' | 'conductive'>('all');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    sound.playFabricRustle(0.4, 0.15);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setHoldProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsHolding(false);
        setHoldProgress(0);
        setIsModalOpen(true);
        sound.playResonantHum(140, 0.6);
      }
    }, 35);
    timerRef.current = interval as unknown as NodeJS.Timeout;
  };

  const endHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* Floating or embedded swatch trigger */}
      <div className="relative group inline-block">
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className="relative overflow-hidden flex items-center gap-3 px-5 py-3 rounded-xl border border-[#00E5C7]/30 bg-[#0D1117]/80 hover:bg-[#121820] backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none"
        >
          {/* Swatch mini preview texture */}
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-[#05070A] flex items-center justify-center">
            {/* Geometric woven swatch pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#00E5C7_1px,transparent_1px)] [background-size:6px_6px] opacity-70" />
            <Sparkles className="w-4 h-4 text-[#00E5C7] relative z-10 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#00E5C7] uppercase tracking-wider">
                SURPRISE 05 &bull; TACTILE INSPECTOR
              </span>
            </div>
            <div className="font-sans text-sm font-medium text-[#F0EFEA] flex items-center gap-1.5">
              <span>Hold to Feel Fabric Weave</span>
              <span className="text-xs text-white/40 font-mono">
                {isHolding ? `${holdProgress}%` : '(Hold 1.5s)'}
              </span>
            </div>
          </div>

          {/* Radial or linear hold fill */}
          {isHolding && (
            <motion.div
              className="absolute left-0 bottom-0 top-0 bg-[#00E5C7]/20 pointer-events-none"
              style={{ width: `${holdProgress}%` }}
              transition={{ ease: 'linear' }}
            />
          )}
        </button>
      </div>

      {/* Fullscreen Macro 3D Weave Inspection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-5xl h-[85vh] bg-[#0A0D12] border border-[#00E5C7]/30 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05070A]/80 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00E5C7] animate-ping" />
                  <div>
                    <h3 className="font-serif text-lg text-[#F0EFEA]">
                      ARANEX Sub-Micron Textile Architecture
                    </h3>
                    <p className="font-mono text-xs text-[#8B949E]">
                      OPTICAL RESOLUTION: 400x MACRO-TOMOGRAPHY &bull; 14nm FILAMENT MAPPING
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Layer separation toggles */}
                  <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs font-mono">
                    {(['all', 'capillary', 'elastomer', 'conductive'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setActiveFibreLayer(l);
                          sound.playTick(700, 0.02);
                        }}
                        className={`px-3 py-1 rounded capitalize transition-all ${
                          activeFibreLayer === l
                            ? 'bg-[#00E5C7]/20 text-[#00E5C7] font-semibold'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      sound.playTick(500, 0.03);
                    }}
                    className="p-2 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 3D Macro Viewport */}
              <div className="flex-1 relative w-full h-full bg-[#05070A]">
                <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                  <MacroWeaveCanvas layerMode={activeFibreLayer} />
                </Canvas>

                {/* Microscopic Annotations HUD */}
                <div className="absolute left-6 bottom-6 max-w-sm pointer-events-none space-y-2">
                  <div className="px-3 py-2 rounded-lg bg-[#0D1117]/80 backdrop-blur-md border border-white/10 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-[#00E5C7]">
                      <span>INTER-FIBRE SEPARATION</span>
                      <span>18.4 &mu;m</span>
                    </div>
                    <p className="text-white/60 text-[11px] font-sans">
                      Fibres dynamically dilate under mechanical tension, amplifying vapor permeability by 310% during peak athletic exertion.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                    <Activity className="w-3.5 h-3.5 text-[#00E5C7]" />
                    <span>DRAG OR ROTATE TO INSPECT WEAVE STRANDS IN 3D</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
