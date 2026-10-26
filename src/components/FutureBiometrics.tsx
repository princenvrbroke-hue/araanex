'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Thermometer, Footprints } from 'lucide-react';
import { Eyebrow } from './ui/Eyebrow';
import { GlassCard } from './ui/GlassCard';
import { sound } from '@/lib/soundEngine';

interface FutureBiometricsProps {
  onExploreFuture?: () => void;
}

const MOVEMENT_BARS = [10, 16, 22, 14, 18, 24, 12, 20];

export function FutureBiometrics({ onExploreFuture }: FutureBiometricsProps) {
  const [heartRate, setHeartRate] = useState(72);
  const [bodyTemp, setBodyTemp] = useState(36.8);
  const [tick, setTick] = useState(0);

  // Simulated readings drift so the HUD feels live (paused for reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      setHeartRate(70 + Math.floor(Math.sin(Date.now() / 1000) * 4));
      setBodyTemp(+(36.8 + Math.sin(Date.now() / 2500) * 0.15).toFixed(1));
      setTick((t) => t + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="section-4"
      tabIndex={-1}
      aria-labelledby="future-title"
      className="relative min-h-[100svh] w-full flex items-center py-20 px-6 md:px-12 xl:pl-[104px] max-w-[1536px] mx-auto z-10 overflow-hidden outline-none"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-5 max-w-[520px]">
          <Eyebrow text="THE FUTURE OF WEARABLES" />

          <h2 id="future-title" className="section-title">
            From Data
            <br />
            <span className="text-gradient-title">to Prevention</span>
          </h2>

          <p className="text-[15px] md:text-[16px] font-light text-[#c9d3e6] leading-[1.55]">
            Imagine clothing that not only keeps you comfortable, but also understands your body. Future wearables may monitor key signals, detect changes and alert you early — helping you stay ahead of potential health concerns.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playTick(750, 0.02);
                onExploreFuture?.();
              }}
              className="group btn-pill-primary"
            >
              <span>Explore the Future</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 relative rounded-2xl border border-[rgba(160,190,255,0.18)] bg-[#0a0f1a]/90 p-5 md:p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(5,8,15,0.8)] overflow-hidden">
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#2f6fe0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-6 min-h-[380px] md:min-h-[420px]">
            <div className="relative w-full md:w-3/5 flex items-center justify-center">
              <div className="relative w-full max-w-[340px] md:max-w-[380px] h-[340px] md:h-[400px] rounded-[8px] overflow-hidden border border-[rgba(160,190,255,0.2)] shadow-[0_0_30px_rgba(90,169,255,0.25)]">
                <Image
                  src="/img/woman-back.webp"
                  alt="A woman seen from behind wearing a fitted top with glowing circuit seams and a sensor node"
                  fill
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover object-center"
                />
                {/* Pulse ring around the photo's own sensor node */}
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: [1, 1.8], opacity: [0.9, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute top-[59%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#5aa9ff] bg-[#5aa9ff]/20"
                />
              </div>
            </div>

            <div className="w-full md:w-2/5 flex flex-col gap-3 z-20">
              <GlassCard className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer size={14} className="text-[#8cc4ff]" />
                    <span className="text-[11px] font-medium tracking-[0.14em] text-[#7f8ba3] uppercase">Body Temperature</span>
                  </div>
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#5aa9ff] animate-pulse" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-medium text-white tabular-nums">{bodyTemp.toFixed(1)}°C</span>
                  <svg aria-hidden="true" className="w-24 h-5 text-[#5aa9ff]" viewBox="0 0 100 20" fill="none">
                    <path d="M0 14 L20 15 L35 10 L50 12 L65 6 L80 10 L100 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              </GlassCard>

              <GlassCard className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-[#8cc4ff]" />
                    <span className="text-[11px] font-medium tracking-[0.14em] text-[#7f8ba3] uppercase">Heart Rate</span>
                  </div>
                  <span className="text-[10px] text-[#8cc4ff] tracking-wider">RESTING</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-medium text-white tabular-nums">
                    {heartRate} <span className="text-xs text-[#7f8ba3]">bpm</span>
                  </span>
                  <svg aria-hidden="true" className="w-28 h-6 text-[#8cc4ff]" viewBox="0 0 120 24" fill="none">
                    <path d="M0 12 H30 L38 2 L46 22 L54 6 L62 16 L70 12 H120" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              </GlassCard>

              <GlassCard className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Footprints size={14} className="text-[#8cc4ff]" />
                    <span className="text-[11px] font-medium tracking-[0.14em] text-[#7f8ba3] uppercase">Movement</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wider">IN SYNC</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-medium text-white">Active</span>
                  <div aria-hidden="true" className="flex items-end gap-1 h-5">
                    {MOVEMENT_BARS.map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: Math.max(6, Math.min(24, h + Math.floor(Math.sin(tick + i) * 6))) }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        className="w-1 bg-[#5aa9ff] rounded-t"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>

              <p className="text-[10px] text-[#7f8ba3] px-1">Simulated readings for illustration.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
