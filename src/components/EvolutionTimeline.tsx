'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eyebrow } from './ui/Eyebrow';
import { PillTabs } from './ui/PillTabs';
import { sound } from '@/lib/soundEngine';

type EraKey = 'past' | 'present' | 'future';

interface EraData {
  id: EraKey;
  label: string;
  title: string;
  tagline: string;
  description: string;
  specs: string[];
  image: string;
  alt: string;
}

const ERAS: EraData[] = [
  {
    id: 'past',
    label: 'PAST',
    title: 'PROTECTION',
    tagline: 'Defend from the elements. Survive in harsh conditions.',
    description:
      'Centuries of rigid armor and thick batting focused purely on physical survivability. Heavy kinetic shielding defended against lethal threats, but came at the expense of mobility, thermal exhaustion, and severe joint friction.',
    specs: ['Kinetic barrier defense', 'Static environmental shield', 'Rigid joint articulation'],
    image: '/img/knight.webp',
    alt: 'A figure in a full suit of plate armour',
  },
  {
    id: 'present',
    label: 'PRESENT',
    title: 'PERFORMANCE',
    tagline: 'Enhance movement. Improve comfort.',
    description:
      'Modern athletic apparel unlocked lightweight 4-way stretch and moisture-wicking microfibers. While optimizing aerodynamics and freedom of motion, standard garments remain passive layers unable to detect metabolic strain.',
    specs: ['Capillary moisture wicking', '4-Way dynamic stretch', 'Ultralight synthetic weave'],
    image: '/img/runner.webp',
    alt: 'A runner mid-stride in fitted sportswear',
  },
  {
    id: 'future',
    label: 'FUTURE',
    title: 'INTELLIGENCE',
    tagline: 'Monitor. Adapt. Support your health.',
    description:
      'ARANEX embeds bio-conductive yarns and phase-change thermal matrices directly into the structural weave. Clothing that senses heart rate, muscular fatigue, and core thermals to dynamically adapt in real time.',
    specs: ['Sub-second biometric sensing', 'Active thermoregulatory airflow', 'Kinetic posture feedback'],
    image: '/img/hologram.webp',
    alt: 'A translucent figure wearing a garment traced with sensor lines',
  },
];

export function EvolutionTimeline() {
  const [activeEra, setActiveEra] = useState<EraKey>('present');
  const selectedEra = ERAS.find((e) => e.id === activeEra) ?? ERAS[1];

  const handleSelectEra = (id: string) => {
    if (id === activeEra) return;
    sound.playTick(600, 0.02);
    setActiveEra(id as EraKey);
    sound.playDataPulse();
  };

  return (
    <section
      id="section-1"
      tabIndex={-1}
      aria-labelledby="evolution-title"
      className="relative min-h-[100svh] w-full flex items-center py-20 px-6 md:px-12 xl:pl-[104px] max-w-[1536px] mx-auto z-10 outline-none"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-5 max-w-[540px]">
          <Eyebrow text="THE EVOLUTION TIMELINE" />

          <h2 id="evolution-title" className="section-title">
            From Protection
            <br />
            <span className="text-gradient-title">to Intelligence</span>
          </h2>

          <p className="text-[15px] md:text-[16px] font-light text-[#c9d3e6] leading-[1.55]">
            Clothing has always evolved with human needs. Now, science is helping it evolve with you.
          </p>

          <div className="pt-1">
            <PillTabs
              items={[
                { id: 'past', label: 'Past' },
                { id: 'present', label: 'Present' },
                { id: 'future', label: 'Future' },
              ]}
              activeId={activeEra}
              onChange={handleSelectEra}
              className="inline-flex w-auto max-w-[290px]"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEra.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              aria-live="polite"
              className="p-4 rounded-lg border border-[rgba(160,190,255,0.18)] bg-[#0d1422]/85 backdrop-blur-md space-y-2.5 shadow-[0_4px_24px_rgba(5,8,15,0.6)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium tracking-[0.14em] text-[#8cc4ff] uppercase">
                  Era: {selectedEra.title}
                </span>
                <span className="text-[11px] text-[#7f8ba3]">{selectedEra.tagline}</span>
              </div>

              <p className="text-[13px] text-[#c9d3e6] leading-relaxed">{selectedEra.description}</p>

              <ul className="pt-2 border-t border-[rgba(160,190,255,0.12)] flex flex-wrap gap-1.5">
                {selectedEra.specs.map((spec) => (
                  <li
                    key={spec}
                    className="px-2.5 py-0.5 rounded-full bg-[#05080f]/70 border border-[rgba(160,190,255,0.15)] text-[11px] text-[#8cc4ff]"
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="relative w-full rounded-2xl overflow-hidden border border-[rgba(160,190,255,0.18)] bg-[#0a0f1a]/90 p-5 md:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(5,8,15,0.8)]">
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-[#2f6fe0]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Three figure cards: Past = Knight, Present = Runner, Future = Hologram */}
            <div className="relative w-full flex items-end justify-between gap-3 md:gap-4 pb-6 pt-2">
              {ERAS.map((era) => {
                const isSelected = activeEra === era.id;
                return (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => handleSelectEra(era.id)}
                    aria-pressed={isSelected}
                    aria-label={`${era.label}: ${era.title}`}
                    className={`relative w-[31%] flex flex-col items-center cursor-pointer transition-all duration-500 ${
                      isSelected ? 'opacity-100 scale-[1.03] z-10' : 'opacity-40 hover:opacity-65 scale-95'
                    }`}
                  >
                    <span
                      className={`relative block w-full h-[220px] md:h-[320px] rounded-xl overflow-hidden border transition-all duration-500 ${
                        isSelected
                          ? 'border-[#5aa9ff] shadow-[0_0_25px_rgba(90,169,255,0.45)]'
                          : 'border-[rgba(160,190,255,0.15)] bg-[#05080f]/50'
                      }`}
                    >
                      <Image
                        src={era.image}
                        alt={era.alt}
                        fill
                        sizes="(min-width: 1024px) 18vw, 31vw"
                        className="object-cover object-top"
                      />
                    </span>
                    <span
                      className={`text-[11px] font-medium tracking-[0.16em] uppercase mt-2.5 transition-colors ${
                        isSelected ? 'text-[#8cc4ff] font-semibold' : 'text-[#7f8ba3]'
                      }`}
                    >
                      {era.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Timeline rail: glowing dot slides to the active era */}
            <div className="pt-3 border-t border-[rgba(160,190,255,0.18)]">
              <div aria-hidden="true" className="relative w-full h-[1px] bg-[rgba(160,190,255,0.2)] my-2.5">
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#5aa9ff] shadow-[0_0_12px_#5aa9ff] border-2 border-[#05080f]"
                  animate={{
                    left: activeEra === 'past' ? '15.5%' : activeEra === 'present' ? '50%' : '84.5%',
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-2" aria-hidden="true">
                {ERAS.map((era) => {
                  const isSelected = activeEra === era.id;
                  return (
                    <div
                      key={era.id}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#0f192d]/80 border border-[#5aa9ff]/40 shadow-[0_0_18px_rgba(70,150,255,0.2)]'
                          : 'opacity-60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-[#5aa9ff] shadow-[0_0_6px_#5aa9ff]' : 'bg-[#7f8ba3]'
                          }`}
                        />
                        <span className="text-[10px] md:text-[11px] font-medium tracking-[0.14em] text-white uppercase truncate">
                          {era.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#c9d3e6] leading-snug line-clamp-2 block">
                        {era.tagline}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
