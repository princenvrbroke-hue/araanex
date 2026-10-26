'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, ShieldCheck, Compass, Move, Wind } from 'lucide-react';
import { Eyebrow } from './ui/Eyebrow';
import { sound } from '@/lib/soundEngine';

type AnatomyZoneKey = 'foot' | 'knee' | 'back' | 'shoulder' | 'torso';

interface ZoneMeta {
  id: AnatomyZoneKey;
  label: string;
  icon: typeof Footprints;
  targetTitle: string;
  short: string;
  tagline: string;
  detail: string;
  zoomScale: number;
  zoomY: number;
}

const ZONES: ZoneMeta[] = [
  {
    id: 'foot',
    label: 'Foot',
    icon: Footprints,
    targetTitle: 'PRESSURE DISTRIBUTION',
    short: 'Pressure Distribution',
    tagline: 'Kinetic Shock Redirection',
    detail: 'Multi-density engineered lattice redirecting vertical heel strike shock into forward kinetic propulsion.',
    zoomScale: 1.15,
    zoomY: -25,
  },
  {
    id: 'knee',
    label: 'Knee',
    icon: ShieldCheck,
    targetTitle: 'STABILITY + COMPRESSION',
    short: 'Stability + Compression',
    tagline: 'Patellar Tendon Protection',
    detail: 'Targeted circumferential compression rings stabilizing the patellar tendon without impeding dynamic flexion.',
    zoomScale: 1.25,
    zoomY: -10,
  },
  {
    id: 'back',
    label: 'Back',
    icon: Compass,
    targetTitle: 'POSTURAL SUPPORT',
    short: 'Postural Support',
    tagline: 'Spinal Decompression & Thermals',
    detail: 'Vertical tensile matrix gently cueing neutral spine alignment with micro-ventilation chimney.',
    zoomScale: 1.2,
    zoomY: 10,
  },
  {
    id: 'shoulder',
    label: 'Shoulder',
    icon: Move,
    targetTitle: 'MOBILITY + FLEXIBILITY',
    short: 'Mobility + Flexibility',
    tagline: 'Rotational Freedom',
    detail: 'Zero-seam raglan articulation with 4-way hyper-elastic shear panels for frictionless overhead reach.',
    zoomScale: 1.25,
    zoomY: 25,
  },
  {
    id: 'torso',
    label: 'Torso',
    icon: Wind,
    targetTitle: 'BREATHABILITY & THERMOREGULATION',
    short: 'Breathability + Temp',
    tagline: 'Microclimate Moisture Evacuation',
    detail: 'Anatomically mapped capillary gradient evacuating perspiration vapor before thermal chill sets in.',
    zoomScale: 1.2,
    zoomY: 15,
  },
];

/** Callout tag positions around the body figure */
const CALLOUT_POS: Record<Exclude<AnatomyZoneKey, 'back'>, string> = {
  shoulder: 'top-[18%] -left-2',
  torso: 'top-[36%] -right-2',
  knee: 'top-[62%] -left-2',
  foot: 'bottom-[6%] -right-2',
};

export function AnatomyExplorer() {
  const [activeZone, setActiveZone] = useState<AnatomyZoneKey>('foot');
  const selectedZone = ZONES.find((z) => z.id === activeZone) ?? ZONES[0];

  const handleSelectZone = (key: AnatomyZoneKey) => {
    if (key === activeZone) return;
    sound.playTick(700, 0.02);
    setActiveZone(key);
    sound.playDataPulse();
  };

  return (
    <section
      id="section-2"
      tabIndex={-1}
      aria-labelledby="anatomy-title"
      className="relative min-h-[100svh] w-full flex items-center py-20 px-6 md:px-12 xl:pl-[104px] max-w-[1536px] mx-auto z-10 overflow-hidden outline-none"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4 max-w-[520px]">
          <Eyebrow text="EXPLORE THE HUMAN BODY" />

          <h2 id="anatomy-title" className="section-title">
            Anatomy Drives
            <br />
            <span className="text-gradient-title">Better Design</span>
          </h2>

          <p className="text-[15px] md:text-[16px] font-light text-[#c9d3e6] leading-[1.55]">
            Your body has unique contours, pressure points, movement patterns and thermal needs. Our wearables are designed around them.
          </p>

          {/* Zone selector */}
          <div role="group" aria-label="Body zones" className="flex flex-wrap lg:flex-col gap-2 pt-1">
            {ZONES.map((zone) => {
              const isSelected = activeZone === zone.id;
              const Icon = zone.icon;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleSelectZone(zone.id)}
                  aria-pressed={isSelected}
                  className={`w-[124px] h-[38px] px-3.5 rounded-full flex items-center gap-2 text-[12px] font-medium transition-all duration-300 border cursor-pointer shrink-0 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#8cc4ff] to-[#5aa9ff] text-[#061021] font-semibold border-transparent shadow-[0_0_20px_rgba(90,169,255,0.45)]'
                      : 'bg-[#0d1422]/70 text-[#c9d3e6] border-[rgba(160,190,255,0.18)] hover:border-[#8cc4ff]/50 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-[#061021]' : 'text-[#8cc4ff]'} />
                  <span className="truncate">{zone.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              aria-live="polite"
              className="p-3.5 rounded-lg border border-[rgba(160,190,255,0.18)] bg-[#0d1422]/85 backdrop-blur-md space-y-1.5 shadow-[0_4px_24px_rgba(5,8,15,0.6)]"
            >
              <div className="text-[11px] font-medium tracking-[0.14em] text-[#8cc4ff] uppercase">
                Target: {selectedZone.targetTitle}
              </div>
              <div className="text-[12px] font-medium text-white">{selectedZone.tagline}</div>
              <p className="text-[12px] text-[#c9d3e6] leading-relaxed">{selectedZone.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-7 relative rounded-2xl border border-[rgba(160,190,255,0.18)] bg-[#0a0f1a]/90 p-5 md:p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(5,8,15,0.8)] overflow-hidden">
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#2f6fe0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-4 min-h-[360px] md:min-h-[420px]">
            {/* Holographic body: zooms toward the selected zone */}
            <div className="relative w-full md:w-3/5 flex items-center justify-center overflow-hidden">
              <motion.div
                className="relative h-[360px] md:h-[420px] aspect-[3/4]"
                animate={{ scale: selectedZone.zoomScale, y: selectedZone.zoomY }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_52%_54%_at_50%_50%,black_72%,transparent_100%)]">
                  <Image
                    src="/img/body-wire.webp"
                    alt="Holographic wireframe of a human body with pressure and heat zones highlighted"
                    fill
                    sizes="(min-width: 1024px) 320px, 270px"
                    className="object-contain drop-shadow-[0_0_20px_rgba(90,169,255,0.4)]"
                  />
                </div>

                {(Object.keys(CALLOUT_POS) as (keyof typeof CALLOUT_POS)[]).map((key) => {
                  const zone = ZONES.find((z) => z.id === key)!;
                  const isSelected = activeZone === key;
                  const isKnee = key === 'knee';
                  return (
                    <button
                      key={key}
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => handleSelectZone(key)}
                      className={`absolute ${CALLOUT_POS[key]} hidden md:block p-2 rounded-md border backdrop-blur-md cursor-pointer text-left transition-all z-20 ${
                        isSelected
                          ? isKnee
                            ? 'border-[#ffa24a] bg-[#1a1309]/95 shadow-[0_0_16px_rgba(255,162,74,0.5)]'
                            : 'border-[#5aa9ff] bg-[#0f192d]/95 shadow-[0_0_16px_rgba(90,169,255,0.5)]'
                          : isKnee
                          ? 'border-[rgba(160,190,255,0.18)] bg-[#0d1422]/80 hover:border-[#ffa24a]/50'
                          : 'border-[rgba(160,190,255,0.18)] bg-[#0d1422]/80 hover:border-[#8cc4ff]/50'
                      }`}
                    >
                      <span className={`block text-[10px] font-medium tracking-wider uppercase ${isKnee ? 'text-[#ffa24a]' : 'text-white'}`}>
                        {zone.label}
                      </span>
                      <span className={`block text-[10px] ${isKnee ? 'text-[#ffa24a]' : 'text-[#8cc4ff]'}`}>{zone.short}</span>
                    </button>
                  );
                })}
              </motion.div>
            </div>

            {/* Kinetic podia matrix */}
            <figure className="w-full md:w-2/5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[260px] overflow-hidden rounded-xl border border-[rgba(160,190,255,0.2)] bg-[#05080f]/75 p-3.5 shadow-lg">
                <span className="text-[10px] font-medium tracking-[0.14em] text-[#8cc4ff] uppercase block mb-1.5">
                  Kinetic Podia Matrix
                </span>
                <div className="relative h-[140px] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/img/shoe-wire.webp"
                    alt="Wireframe running shoe with a pressure heatmap on the sole"
                    fill
                    sizes="240px"
                    className="object-cover drop-shadow-[0_0_16px_rgba(90,169,255,0.45)] hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <figcaption className="mt-2.5 pt-2 border-t border-[rgba(160,190,255,0.12)] text-[11px] text-[#7f8ba3]">
                  Pressure mapped across the sole through each stride.
                </figcaption>
              </div>
            </figure>
          </div>

          {/* Diagnostic legend */}
          <div className="relative mt-4 pt-3 border-t border-[rgba(160,190,255,0.18)] flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              <span className="flex items-center gap-1.5 text-[#c9d3e6]">
                <span className="w-2 h-2 rounded-full bg-[#5aa9ff] shadow-[0_0_6px_#5aa9ff]" />
                Structure
              </span>
              <span className="flex items-center gap-1.5 text-[#c9d3e6]">
                <span className="w-2 h-2 rounded-full bg-[#ffa24a] shadow-[0_0_6px_#ffa24a]" />
                Heat &amp; load zones
              </span>
            </div>
            <div className="text-[#7f8ba3]">
              Active: <span className="uppercase font-semibold text-[#8cc4ff]">{selectedZone.label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
