'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Move, Thermometer, Cpu } from 'lucide-react';
import { Eyebrow } from './ui/Eyebrow';
import { IconBadge } from './ui/IconBadge';
import { sound } from '@/lib/soundEngine';

interface LayerSpec {
  id: string;
  name: string;
  sub: string;
  description: string;
  explodedOffset: number;
  bgGradient: string;
  glowShadow: string;
}

const LAYERS: LayerSpec[] = [
  {
    id: 'sensor',
    name: 'Smart Sensor Layer (Future)',
    sub: 'Biometric feedback & electrometric traces',
    description: 'Conductive silver-graphene circuit traces and piezoelectric sensing nodes reading muscular excitation.',
    explodedOffset: -140,
    bgGradient: 'from-[#1c335a]/95 to-[#10223e]/95',
    glowShadow: '0 0 28px rgba(90,169,255,0.7)',
  },
  {
    id: 'mesh',
    name: 'Breathable Mesh (Active Ventilation)',
    sub: 'Micro-convection airflow louvers',
    description: 'Cellular lattice structure that opens dynamically under garment stretch to exhaust heat and perspiration vapor.',
    explodedOffset: -70,
    bgGradient: 'from-[#142848]/90 to-[#0e1c34]/90',
    glowShadow: '0 0 24px rgba(140,196,255,0.5)',
  },
  {
    id: 'stretch',
    name: 'Stretch Layer (Enhanced Mobility)',
    sub: '4-way elastic memory',
    description: 'Dual-helix elastane filaments offering 360-degree anatomical recovery with zero joint restriction.',
    explodedOffset: 0,
    bgGradient: 'from-[#10203c]/90 to-[#0a162a]/90',
    glowShadow: '0 0 24px rgba(90,169,255,0.45)',
  },
  {
    id: 'comfort',
    name: 'Comfort Layer (Soft Touch)',
    sub: 'Frictionless dermal buffer',
    description: 'Brushed micro-fiber blend eliminating friction hotspots against sensitive skin zones.',
    explodedOffset: 70,
    bgGradient: 'from-[#0e1b32]/90 to-[#081222]/90',
    glowShadow: '0 0 20px rgba(140,196,255,0.4)',
  },
  {
    id: 'protect',
    name: 'Protective Layer (Durability)',
    sub: 'Tensile barrier shield',
    description: 'Ultra-high molecular weight synthetic weave offering extreme abrasion defense and weather repellency.',
    explodedOffset: 140,
    bgGradient: 'from-[#081220]/95 to-[#050b16]/95',
    glowShadow: '0 0 22px rgba(47,111,224,0.5)',
  },
];

const FEATURES = [
  { icon: Droplets, title: 'Moisture Management', sub: 'Keeps you dry and comfortable' },
  { icon: Move, title: '4-Way Stretch', sub: 'Moves with your body' },
  { icon: Thermometer, title: 'Thermal Regulation', sub: 'Adapts to your environment' },
  { icon: Cpu, title: 'Smart Textile Integration', sub: 'The future is sensor-enabled' },
];

export function ExplodedMaterialsView() {
  const [activeLayerId, setActiveLayerId] = useState('sensor');
  const [isExploded, setIsExploded] = useState(true);
  const selectedLayer = LAYERS.find((l) => l.id === activeLayerId) ?? LAYERS[0];

  const handleSelectLayer = (id: string) => {
    if (id === activeLayerId) return;
    sound.playTick(650, 0.02);
    setActiveLayerId(id);
    sound.playDataPulse();
  };

  return (
    <section
      id="section-3"
      tabIndex={-1}
      aria-labelledby="materials-title"
      className="relative min-h-[100svh] w-full flex items-center py-20 px-6 md:px-12 xl:pl-[104px] max-w-[1536px] mx-auto z-10 overflow-hidden outline-none"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4 max-w-[520px]">
          <Eyebrow text="ENGINEERED MATERIALS" />

          <h2 id="materials-title" className="section-title">
            More Than Fabric.
            <br />
            <span className="text-gradient-title">A Functional System.</span>
          </h2>

          <p className="text-[15px] md:text-[16px] font-light text-[#c9d3e6] leading-[1.55]">
            We combine advanced textile technologies with anatomical design to create wearables that breathe, adapt and perform.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <li
                  key={feat.title}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-[rgba(160,190,255,0.15)] bg-[#0d1422]/70 backdrop-blur-md"
                >
                  <IconBadge size={36}>
                    <Icon size={16} className="text-[#8cc4ff]" />
                  </IconBadge>
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-white truncate">{feat.title}</div>
                    <div className="text-[11px] text-[#7f8ba3] truncate">{feat.sub}</div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="p-3.5 rounded-lg border border-[rgba(160,190,255,0.18)] bg-[#0d1422]/85 backdrop-blur-md space-y-1.5 shadow-[0_4px_24px_rgba(5,8,15,0.6)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-[0.14em] text-[#8cc4ff] uppercase">
                Stratum Analysis
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playTick(500, 0.02);
                  setIsExploded((v) => !v);
                }}
                className="text-[11px] text-[#8cc4ff] hover:text-white cursor-pointer transition-colors"
              >
                {isExploded ? 'Collapse stack' : 'Explode stack'}
              </button>
            </div>
            <div aria-live="polite">
              <div className="text-[13px] font-medium text-white">{selectedLayer.name}</div>
              <p className="text-[12px] text-[#c9d3e6] leading-relaxed mt-1">{selectedLayer.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 relative rounded-2xl border border-[rgba(160,190,255,0.18)] bg-[#0a0f1a]/90 p-5 md:p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(5,8,15,0.8)] overflow-hidden">
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#2f6fe0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[380px] md:min-h-[420px]">
            {/* Isometric exploded 5-layer stack */}
            <div aria-hidden="true" className="relative w-full lg:w-3/5 flex items-center justify-center py-16">
              <div className="relative w-[260px] h-[200px] md:w-[320px] md:h-[240px]" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
                {LAYERS.map((layer) => {
                  const isSelected = activeLayerId === layer.id;
                  return (
                    <motion.div
                      key={layer.id}
                      onClick={() => handleSelectLayer(layer.id)}
                      animate={{
                        y: (isExploded ? layer.explodedOffset : 0) + (isSelected ? -12 : 0),
                        rotateX: 55,
                        rotateZ: -25,
                        scale: isSelected ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute inset-0 rounded-xl cursor-pointer transition-colors duration-300 border bg-gradient-to-tr ${layer.bgGradient}`}
                      style={{
                        borderColor: isSelected ? '#5aa9ff' : 'rgba(160,190,255,0.35)',
                        boxShadow: isSelected ? layer.glowShadow : '0 4px 16px rgba(0,0,0,0.5)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {layer.id === 'sensor' && (
                        <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] text-[#8cc4ff]" viewBox="0 0 200 140" fill="none">
                          <path
                            d="M20 30 H80 L100 50 H180 M30 85 H120 L140 105 H170 M90 20 V65 M140 70 V125"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                          />
                          <circle cx="100" cy="50" r="3.5" fill="#5aa9ff" />
                          <circle cx="140" cy="105" r="3.5" fill="#5aa9ff" />
                        </svg>
                      )}
                      {layer.id === 'mesh' && (
                        <div
                          className="absolute inset-0 opacity-30 rounded-xl"
                          style={{
                            backgroundImage: 'radial-gradient(#8cc4ff 1.2px, transparent 1.2px)',
                            backgroundSize: '10px 10px',
                          }}
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#5aa9ff] to-transparent opacity-90" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Layer index */}
            <div role="group" aria-label="Fabric layers, outermost first" className="w-full lg:w-2/5 flex flex-col gap-2 z-20">
              {LAYERS.map((layer) => {
                const isSelected = activeLayerId === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => handleSelectLayer(layer.id)}
                    aria-pressed={isSelected}
                    className={`text-left p-2.5 px-3 rounded-lg border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                      isSelected
                        ? 'border-[#5aa9ff] bg-[#0f192d]/95 shadow-[0_0_20px_rgba(70,150,255,0.35)] -translate-x-1'
                        : 'border-[rgba(160,190,255,0.18)] bg-[#0d1422]/65 hover:border-[#8cc4ff]/50 hover:bg-[#0d1422]/90'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-white truncate">{layer.name}</span>
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ml-2 ${
                          isSelected ? 'bg-[#5aa9ff] shadow-[0_0_8px_#5aa9ff]' : 'bg-[#7f8ba3]'
                        }`}
                      />
                    </span>
                    <span className="block text-[10px] text-[#7f8ba3] mt-0.5 truncate">{layer.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
