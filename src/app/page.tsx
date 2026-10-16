'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ChevronRight,
  Sliders,
  Wind,
  Flame,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Shield,
  HelpCircle,
  FileText,
  Mail,
  Zap,
} from 'lucide-react';

import { ARANEX_CONTENT, Archetype, AnatomicalZone, BiomechanicsProblem, ConstellationNode } from '@/content/aranexData';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { Preloader } from '@/components/Preloader';
import { CursorTrail } from '@/components/CursorTrail';
import { Navigation } from '@/components/Navigation';
import { ChapterRail } from '@/components/ChapterRail';
import { EvidenceBadge } from '@/components/EvidenceBadge';
import { MacroFabricSwatch } from '@/components/MacroFabricSwatch';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { ResearchModal } from '@/components/ResearchModal';
import { EmailCaptureModal } from '@/components/EmailCaptureModal';
import { EasterEggModal } from '@/components/EasterEggModal';
import { sound } from '@/lib/soundEngine';

// Dynamically import Three.js CanvasContainer with SSR disabled
const CanvasContainer = dynamic(
  () => import('@/scenes/CanvasContainer').then((mod) => mod.CanvasContainer),
  { ssr: false }
);

export default function AranexExperience() {
  const {
    progress: scrollProgress,
    velocity: scrollVelocity,
    activeSection,
    isExhaling,
    scrollToSection,
  } = useScrollProgress();

  const {
    mode: timeMode,
    activeKey: activeTimeKey,
    currentHour,
    preset: lightingPreset,
    setMode: setTimeMode,
  } = useTimeOfDay();

  // State management across all sections
  const [activeOriginIndex, setActiveOriginIndex] = useState(0);
  const [activeArchetype, setActiveArchetype] = useState<Archetype['id']>('soldier');
  const [poloSliderValue, setPoloSliderValue] = useState(0.5);
  const [activeAnatomyZone, setActiveAnatomyZone] = useState<AnatomicalZone['id']>('torso');
  const [isAnatomyEngineered, setIsAnatomyEngineered] = useState(false);
  const [anatomyLayer, setAnatomyLayer] = useState<'pressure' | 'friction' | 'movement' | 'ventilation'>('ventilation');
  const [activeExplodedLayer, setActiveExplodedLayer] = useState('layer-1');
  const [activeProblem, setActiveProblem] = useState<BiomechanicsProblem['id']>('friction');
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [activeConstellationNode, setActiveConstellationNode] = useState<ConstellationNode | null>(null);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const selectedProblemData =
    ARANEX_CONTENT.section06_health.problems.find((p) => p.id === activeProblem) || null;

  return (
    <main className="relative min-h-screen bg-[#05070A] text-[#F0EFEA] overflow-x-hidden selection:bg-[#00E5C7] selection:text-[#05070A]">
      {/* 1. Thread-Weaving Preloader */}
      <Preloader />

      {/* 2. Cursor Light Thread Trail (Surprise #1) */}
      <CursorTrail />

      {/* 3. Subtle Cinematic Film Grain Overlay */}
      <div className="film-grain" />

      {/* 4. Global Persistent 3D Canvas Rig */}
      <CanvasContainer
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        activeSection={activeSection}
        isExhaling={isExhaling}
        lightingPreset={lightingPreset}
        activeOriginItem={activeOriginIndex}
        onSelectOriginItem={setActiveOriginIndex}
        activeArchetype={activeArchetype}
        poloSliderValue={poloSliderValue}
        activeAnatomyZone={activeAnatomyZone}
        onSelectAnatomyZone={setActiveAnatomyZone}
        isAnatomyEngineered={isAnatomyEngineered}
        anatomyLayer={anatomyLayer}
        activeExplodedLayer={activeExplodedLayer}
        onSelectExplodedLayer={setActiveExplodedLayer}
        activeProblem={activeProblem}
        onSelectConstellationNode={(node) => setActiveConstellationNode(node)}
      />

      {/* 5. Minimal Glassmorphism Navigation */}
      <Navigation
        timeMode={timeMode}
        activeTimeKey={activeTimeKey}
        currentHour={currentHour}
        onSelectTimeMode={setTimeMode}
        onSelectSection={scrollToSection}
        onOpenEasterEgg={() => setIsEasterEggOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      {/* 6. Vertical Chapter Progress Rail (01 - 08) */}
      <ChapterRail activeSection={activeSection} onSelect={scrollToSection} />

      {/* ========================================================================= */}
      {/* 00 HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section
        id="section-0"
        className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-6 md:px-20 max-w-7xl mx-auto z-10 pointer-events-none"
      >
        <div className="space-y-4 max-w-3xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5C7] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#00E5C7] uppercase">
              {ARANEX_CONTENT.hero.badge}
            </span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#F0EFEA] leading-[1.08]">
            For centuries, we have worn clothes.{' '}
            <span className="italic text-[#00E5C7]/90 font-serif-editorial block sm:inline">
              It&apos;s time our clothes did more for us.
            </span>
          </h1>

          <p className="font-sans text-lg sm:text-xl text-white/70 max-w-2xl font-light leading-relaxed pt-2">
            {ARANEX_CONTENT.hero.subhead}
          </p>

          <p className="font-sans text-sm text-white/50 max-w-xl leading-relaxed">
            {ARANEX_CONTENT.hero.narrative}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection(4)}
              className="px-6 py-3 rounded-full bg-[#00E5C7] hover:bg-[#56FFDD] text-[#05070A] text-xs font-mono font-semibold tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,229,199,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>{ARANEX_CONTENT.hero.ctaPrimary}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection(7)}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[#F0EFEA] text-xs font-mono tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              <span>{ARANEX_CONTENT.hero.ctaSecondary}</span>
            </button>
          </div>
        </div>

        {/* Bottom Swatch & Scroll Prompt */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pointer-events-auto pt-12">
          {/* Surprise #5: "Feel the Fabric" interactive swatch */}
          <MacroFabricSwatch />

          <div className="flex items-center gap-3 text-xs font-mono text-white/40">
            <span className="uppercase tracking-widest">Scroll to Journey</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
              <ArrowDown className="w-3.5 h-3.5 text-[#00E5C7]" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 01 THE ORIGIN: "Before Fashion, There Was Function"                       */}
      {/* ========================================================================= */}
      <section
        id="section-1"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#E5A93C] tracking-widest uppercase">
              CHAPTER 01 &bull; {ARANEX_CONTENT.section01_origin.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section01_origin.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section01_origin.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section01_origin.lead}
          </p>
        </div>

        {/* Horizontal Timeline Era Selectors */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pointer-events-auto max-w-5xl">
          {ARANEX_CONTENT.section01_origin.items.map((item, idx) => {
            const isSelected = activeOriginIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playTick(500 + idx * 50, 0.03);
                  setActiveOriginIndex(idx);
                }}
                className={`p-4 rounded-xl border text-left transition-all backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? 'bg-[#121820]/90 border-[#E5A93C] shadow-[0_0_20px_rgba(229,169,60,0.25)]'
                    : 'bg-[#05070A]/70 border-white/10 hover:border-white/30 text-white/60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="text-[#E5A93C]">{item.year}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                    {item.purpose}
                  </span>
                </div>
                <h3 className="font-serif-editorial text-base text-[#F0EFEA] font-normal leading-snug">
                  {item.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Selected Era Biomechanical Detail Card */}
        {ARANEX_CONTENT.section01_origin.items[activeOriginIndex] && (
          <motion.div
            key={activeOriginIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl bg-[#0D1117]/85 border border-[#E5A93C]/30 max-w-2xl backdrop-blur-xl pointer-events-auto space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs text-[#E5A93C] tracking-wider uppercase">
                BIOMECHANICAL ARCHITECTURE
              </span>
              <span className="font-mono text-xs text-white/50">
                {ARANEX_CONTENT.section01_origin.items[activeOriginIndex].materials}
              </span>
            </div>
            <p className="font-sans text-sm text-white/80 leading-relaxed">
              {ARANEX_CONTENT.section01_origin.items[activeOriginIndex].description}
            </p>
            <div className="text-xs font-mono text-[#E5A93C]/90 bg-[#E5A93C]/10 p-2.5 rounded-lg border border-[#E5A93C]/20">
              {ARANEX_CONTENT.section01_origin.items[activeOriginIndex].biomechanics}
            </div>
          </motion.div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 02 CLOTHING & PERFORMANCE: "Different Roles. Different Demands."          */}
      {/* ========================================================================= */}
      <section
        id="section-2"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 02 &bull; {ARANEX_CONTENT.section02_performance.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section02_performance.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section02_performance.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section02_performance.lead}
          </p>
        </div>

        {/* 4 Archetypes Selector Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 pointer-events-auto">
          {ARANEX_CONTENT.section02_performance.archetypes.map((archetype) => {
            const isSelected = activeArchetype === archetype.id;
            return (
              <button
                key={archetype.id}
                onClick={() => {
                  sound.playResonantHum(120, 0.4);
                  setActiveArchetype(archetype.id);
                }}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#121820] border-[#00E5C7] text-[#00E5C7] shadow-[0_0_20px_rgba(0,229,199,0.2)]'
                    : 'bg-[#05070A]/80 border-white/10 hover:border-white/30 text-white/60'
                }`}
              >
                {archetype.name.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Active Archetype Stat & Demands Panel */}
        {(() => {
          const arch =
            ARANEX_CONTENT.section02_performance.archetypes.find(
              (a) => a.id === activeArchetype
            ) || ARANEX_CONTENT.section02_performance.archetypes[0];

          return (
            <motion.div
              key={arch.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-[#0D1117]/90 border border-white/10 max-w-xl backdrop-blur-xl pointer-events-auto space-y-4 shadow-2xl"
            >
              <div>
                <span className="font-mono text-xs text-[#00E5C7] uppercase tracking-wider">
                  OCCUPATIONAL BIOMECHANICS
                </span>
                <h3 className="font-serif-editorial text-xl text-[#F0EFEA] mt-0.5">
                  {arch.tagline}
                </h3>
                <p className="font-sans text-xs text-white/70 mt-2 leading-relaxed">
                  {arch.description}
                </p>
              </div>

              {/* Stress Points */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {arch.stressPoints.map((pt, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/70"
                  >
                    {pt}
                  </span>
                ))}
              </div>

              {/* Animated Demand Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-white/40 block text-[10px]">THERMAL GRADIENT</span>
                  <span className="text-[#00E5C7] font-semibold">{arch.metrics.thermalGradient}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-white/40 block text-[10px]">FRICTION COEFFICIENT</span>
                  <span className="text-[#E5A93C] font-semibold">{arch.metrics.frictionIndex}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-white/40 block text-[10px]">KINETIC CONSTRAINT</span>
                  <span className="text-white/80 font-semibold">{arch.metrics.kineticResistance}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-white/40 block text-[10px]">COMPRESSION PROFILE</span>
                  <span className="text-[#58A6FF] font-semibold">{arch.metrics.compressionNeed}</span>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </section>

      {/* ========================================================================= */}
      {/* 03 THE POLO SHIRT: "When Performance Changed Fashion"                     */}
      {/* ========================================================================= */}
      <section
        id="section-3"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 03 &bull; {ARANEX_CONTENT.section03_polo.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section03_polo.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section03_polo.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section03_polo.lead}
          </p>
        </div>

        {/* 3D Before/After Morphing Drag Slider */}
        <div className="mt-10 p-6 rounded-2xl bg-[#0D1117]/85 border border-white/10 max-w-xl backdrop-blur-xl pointer-events-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/60">
              1920s STARCHED WEAVE
            </span>
            <span className="font-mono text-xs text-[#00E5C7]">
              MODERN ENGINEERED POLO
            </span>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={poloSliderValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPoloSliderValue(val);
                if (Math.abs(val - 0.5) < 0.05) sound.playTick(600, 0.02);
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00E5C7]"
              aria-label="Morph between 1920s tennis dress and modern polo shirt"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/40">
              <span>0% (Starched Rigid Cotton)</span>
              <span>Drag to morph 3D silhouette</span>
              <span>100% (Breathable Piqué Mesh)</span>
            </div>
          </div>

          {/* Side by side comparison features */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className={`p-3 rounded-xl transition-all ${poloSliderValue < 0.5 ? 'bg-white/10 border border-white/20' : 'opacity-40'}`}>
              <span className="font-mono text-[10px] text-white/50 block mb-1">TRADITIONAL 1920s</span>
              <p className="text-white/80 font-sans text-xs">
                {ARANEX_CONTENT.section03_polo.comparison.year1920.features[0]}
              </p>
            </div>

            <div className={`p-3 rounded-xl transition-all ${poloSliderValue >= 0.5 ? 'bg-[#00E5C7]/10 border border-[#00E5C7]/30 text-[#00E5C7]' : 'opacity-40'}`}>
              <span className="font-mono text-[10px] text-[#00E5C7] block mb-1">ENGINEERED SOLUTION</span>
              <p className="text-white/80 font-sans text-xs">
                {ARANEX_CONTENT.section03_polo.comparison.modern.features[0]}
              </p>
            </div>
          </div>

          <p className="font-serif-editorial text-xs italic text-white/60 border-t border-white/10 pt-3">
            {ARANEX_CONTENT.section03_polo.quote}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 THE SCIENCE OF WHAT WE WEAR: "Your Body Is Not Uniform."               */}
      {/* ========================================================================= */}
      <section
        id="section-4"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 04 &bull; {ARANEX_CONTENT.section04_anatomy.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section04_anatomy.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section04_anatomy.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section04_anatomy.lead}
          </p>
        </div>

        {/* Anatomical Zone Selector Buttons & Toggle */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 pointer-events-auto max-w-3xl">
          {/* Tappable Zone Buttons */}
          <div className="flex flex-wrap gap-2">
            {ARANEX_CONTENT.section04_anatomy.zones.map((zone) => {
              const isSelected = activeAnatomyZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    sound.playResonantHum(160, 0.3);
                    setActiveAnatomyZone(zone.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs tracking-wider transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#00E5C7]/15 border-[#00E5C7] text-[#00E5C7]'
                      : 'bg-[#05070A]/80 border-white/10 hover:border-white/30 text-white/60'
                  }`}
                >
                  {zone.name.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Uniform vs Engineered Toggle */}
          <button
            onClick={() => {
              sound.playDataPulse();
              setIsAnatomyEngineered(!isAnatomyEngineered);
            }}
            className={`px-4 py-2 rounded-xl border text-xs font-mono tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              isAnatomyEngineered
                ? 'bg-[#00E5C7]/20 border-[#00E5C7] text-[#00E5C7]'
                : 'bg-red-950/20 border-red-500/30 text-red-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAnatomyEngineered ? 'Anatomically Engineered' : 'Uniform Garment (Legacy)'}</span>
          </button>
        </div>

        {/* Heat Map Layer Selector */}
        <div className="mt-4 flex gap-2 pointer-events-auto">
          {(['pressure', 'friction', 'movement', 'ventilation'] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                sound.playTick(650, 0.02);
                setAnatomyLayer(l);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
                anatomyLayer === l
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Active Zone Detail Card */}
        {(() => {
          const zone =
            ARANEX_CONTENT.section04_anatomy.zones.find(
              (z) => z.id === activeAnatomyZone
            ) || ARANEX_CONTENT.section04_anatomy.zones[0];

          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-[#0D1117]/90 border border-white/10 max-w-xl backdrop-blur-xl pointer-events-auto space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <span className="font-mono text-[10px] text-[#00E5C7] tracking-widest uppercase">
                    ANATOMICAL SITE
                  </span>
                  <h3 className="font-serif-editorial text-xl text-[#F0EFEA]">
                    {zone.anatomicalName}
                  </h3>
                </div>
                <div className="text-right font-mono text-[11px] text-white/50">
                  <span>AIRFLOW: </span>
                  <span className="text-[#00E5C7] font-semibold">{zone.airflowMetric}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200">
                  <span className="font-mono text-[10px] text-red-400 block mb-0.5">THE BIOMECHANICAL PROBLEM</span>
                  {zone.primaryIssue}
                </div>
                <div className="p-2.5 rounded-lg bg-[#00E5C7]/10 border border-[#00E5C7]/30 text-cyan-200">
                  <span className="font-mono text-[10px] text-[#00E5C7] block mb-0.5">ARANEX ARCHITECTURE</span>
                  {zone.aranexSolution}
                </div>
              </div>

              {/* Real-time Physiological Stress Gauges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono border-t border-white/10">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-white/40 block">PRESSURE PEAK</span>
                  <span className="text-red-400 font-semibold">{zone.pressureData} kPa</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-white/40 block">FRICTION INDEX</span>
                  <span className="text-amber-400 font-semibold">{zone.frictionData} / 100</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-white/40 block">SWEAT FLUX</span>
                  <span className="text-cyan-400 font-semibold">{zone.sweatRate} g/m²/h</span>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </section>

      {/* ========================================================================= */}
      {/* 05 THE ARANEX APPROACH: "Engineered Around Anatomy."                       */}
      {/* ========================================================================= */}
      <section
        id="section-5"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 05 &bull; {ARANEX_CONTENT.section05_aranex.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section05_aranex.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section05_aranex.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section05_aranex.lead}
          </p>
        </div>

        {/* 4 Exploded View Layer Tabs */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pointer-events-auto max-w-5xl">
          {ARANEX_CONTENT.section05_aranex.layers.map((layer) => {
            const isSelected = activeExplodedLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  sound.playTick(500 + layer.level * 50, 0.03);
                  setActiveExplodedLayer(layer.id);
                }}
                className={`p-4 rounded-xl border text-left transition-all backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? 'bg-[#121820]/90 border-[#00E5C7] shadow-[0_0_20px_rgba(0,229,199,0.25)]'
                    : 'bg-[#05070A]/70 border-white/10 hover:border-white/30 text-white/60'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#00E5C7] mb-1">
                  <span>LAYER 0{layer.level}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                </div>
                <h3 className="font-serif-editorial text-base text-[#F0EFEA] font-medium leading-snug">
                  {layer.name}
                </h3>
                <p className="text-white/50 text-xs mt-1 font-sans line-clamp-2">
                  {layer.engineeringRole}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Material Specs */}
        {(() => {
          const lyr =
            ARANEX_CONTENT.section05_aranex.layers.find(
              (l) => l.id === activeExplodedLayer
            ) || ARANEX_CONTENT.section05_aranex.layers[0];

          return (
            <motion.div
              key={lyr.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-[#0D1117]/85 border border-[#00E5C7]/30 max-w-xl backdrop-blur-xl pointer-events-auto space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-xs text-[#00E5C7] uppercase tracking-wider">
                  MATERIAL ARCHITECTURE &bull; LAYER 0{lyr.level}
                </span>
                <span className="text-[10px] font-mono text-white/40">SCROLL SCRUBS 3D EXPLOSION</span>
              </div>
              <p className="font-mono text-xs text-white/80">{lyr.material}</p>
              <div className="space-y-1.5 pt-1">
                {lyr.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-sans text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5C7]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </section>

      {/* ========================================================================= */}
      {/* 06 BEYOND COMFORT: "Can Better Clothing Contribute to Better Health?"     */}
      {/* ========================================================================= */}
      <section
        id="section-6"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 06 &bull; {ARANEX_CONTENT.section06_health.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section06_health.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section06_health.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section06_health.lead}
          </p>
        </div>

        {/* 4 Interactive Problem Selectors */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pointer-events-auto max-w-5xl">
          {ARANEX_CONTENT.section06_health.problems.map((prob) => {
            const isSelected = activeProblem === prob.id;
            return (
              <button
                key={prob.id}
                onClick={() => {
                  sound.playResonantHum(140, 0.4);
                  setActiveProblem(prob.id);
                }}
                className={`p-4 rounded-xl border text-left transition-all backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? 'bg-[#121820]/90 border-cyan-400 shadow-[0_0_20px_rgba(0,229,199,0.25)]'
                    : 'bg-[#05070A]/70 border-white/10 hover:border-white/30 text-white/60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#00E5C7] mb-1">
                  <span>PHYSIOLOGICAL STRESS</span>
                </div>
                <h3 className="font-serif-editorial text-base text-[#F0EFEA] font-medium leading-snug">
                  {prob.title}
                </h3>
                <p className="text-white/50 text-xs mt-1 font-sans line-clamp-2">
                  {prob.subhead}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Problem Solution & Evidence Drawer Trigger */}
        {(() => {
          const prob =
            ARANEX_CONTENT.section06_health.problems.find(
              (p) => p.id === activeProblem
            ) || ARANEX_CONTENT.section06_health.problems[0];

          return (
            <motion.div
              key={prob.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-[#0D1117]/85 border border-white/10 max-w-xl backdrop-blur-xl pointer-events-auto space-y-4 shadow-2xl"
            >
              <div>
                <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest">
                  EPIDERMAL &amp; MUSCULOSKELETAL IMPACT
                </span>
                <p className="text-xs font-sans text-white/80 mt-1 leading-relaxed">
                  {prob.anatomicalImpact}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#00E5C7]/10 border border-[#00E5C7]/30">
                <span className="font-mono text-[10px] text-[#00E5C7] block uppercase tracking-wider mb-0.5">
                  ARANEX DESIGN PRINCIPLE
                </span>
                <p className="text-xs font-sans text-cyan-100 leading-relaxed">
                  {prob.aranexPrinciple}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    sound.playDataPulse();
                    setIsEvidenceDrawerOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#00E5C7] text-xs font-mono tracking-wider transition-all border border-white/15"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Scientific Citations ({prob.evidence.year})</span>
                </button>
                <span className="text-[10px] font-mono text-white/40">Non-diagnostic research</span>
              </div>
            </motion.div>
          );
        })()}

        {/* Evidence Drawer Modal */}
        <EvidenceDrawer
          problem={selectedProblemData}
          isOpen={isEvidenceDrawerOpen}
          onClose={() => setIsEvidenceDrawerOpen(false)}
        />
      </section>

      {/* ========================================================================= */}
      {/* 07 THE FUTURE: "What If Your Clothing Could Understand Your Body?"         */}
      {/* ========================================================================= */}
      <section
        id="section-7"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 07 &bull; {ARANEX_CONTENT.section07_future.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section07_future.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section07_future.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section07_future.lead}
          </p>

          {/* Prominent Research Direction Label Guardrail */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 text-xs font-mono">
            {ARANEX_CONTENT.section07_future.disclaimer}
          </div>
        </div>

        {/* Future Sensing Specs Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pointer-events-auto max-w-4xl">
          {ARANEX_CONTENT.section07_future.sensingFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-5 rounded-2xl bg-[#0D1117]/85 border border-[#00E5C7]/30 backdrop-blur-xl space-y-2 shadow-[0_0_20px_rgba(0,229,199,0.1)]"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#00E5C7] uppercase">{feat.status}</span>
                <Zap className="w-3.5 h-3.5 text-[#00E5C7]" />
              </div>
              <h3 className="font-serif-editorial text-lg text-[#F0EFEA] font-medium">
                {feat.title}
              </h3>
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                {feat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 OUR VISION: "The Next Evolution of Clothing Starts with Science."       */}
      {/* ========================================================================= */}
      <section
        id="section-8"
        className="relative min-h-[140vh] py-32 px-6 md:px-20 max-w-7xl mx-auto z-10 flex flex-col justify-center pointer-events-none"
      >
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00E5C7] tracking-widest uppercase">
              CHAPTER 08 &bull; {ARANEX_CONTENT.section08_vision.tag}
            </span>
            <EvidenceBadge level={ARANEX_CONTENT.section08_vision.evidenceLevel} />
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#F0EFEA]">
            {ARANEX_CONTENT.section08_vision.title}
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
            {ARANEX_CONTENT.section08_vision.lead}
          </p>
        </div>

        {/* Constellation Nodes Interactive Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pointer-events-auto max-w-5xl">
          {ARANEX_CONTENT.section08_vision.nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => {
                sound.playDataPulse();
                setActiveConstellationNode(node);
              }}
              className="p-5 rounded-2xl bg-[#0D1117]/80 border border-white/10 hover:border-[#00E5C7]/50 text-left transition-all backdrop-blur-xl group cursor-pointer shadow-xl"
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-[#00E5C7] mb-2 uppercase">
                <span>{node.status}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="font-serif-editorial text-lg text-[#F0EFEA] font-medium group-hover:text-white">
                {node.title}
              </h3>
              <p className="font-sans text-xs text-white/60 mt-1 line-clamp-3">
                {node.summary}
              </p>
            </button>
          ))}
        </div>

        {/* Quiet Closing CTAs */}
        <div className="mt-12 flex flex-wrap items-center gap-4 pointer-events-auto">
          <button
            onClick={() => scrollToSection(5)}
            className="px-6 py-3 rounded-full bg-[#00E5C7] hover:bg-[#56FFDD] text-[#05070A] text-xs font-mono font-semibold tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,229,199,0.3)] cursor-pointer"
          >
            {ARANEX_CONTENT.section08_vision.cta.primary}
          </button>

          <button
            onClick={() => {
              sound.playDataPulse();
              setIsEmailModalOpen(true);
            }}
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-[#F0EFEA] text-xs font-mono tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#00E5C7]" />
            <span>{ARANEX_CONTENT.section08_vision.cta.secondary}</span>
          </button>
        </div>

        {/* Constellation Deep-Dive Modal */}
        <ResearchModal
          node={activeConstellationNode}
          isOpen={!!activeConstellationNode}
          onClose={() => setActiveConstellationNode(null)}
        />
      </section>

      {/* ========================================================================= */}
      {/* FOOTER & SURPRISE #6 EXHALE                                               */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 bg-[#05070A]/95 backdrop-blur-xl py-16 px-6 md:px-20 text-xs font-sans text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-serif-editorial text-lg tracking-[0.2em] font-light text-[#F0EFEA] uppercase">
                ARANEX
              </span>
              <span className="font-mono text-[9px] text-[#00E5C7] uppercase">
                BIO-WEARABLE ARCHITECTURE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/40">
              {ARANEX_CONTENT.section08_vision.cta.disclaimer}
            </p>
          </div>

          {/* Footer Exhale Status Indicator (Surprise #6) */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${
                isExhaling ? 'bg-[#00E5C7] scale-150 animate-pulse shadow-[0_0_12px_#00E5C7]' : 'bg-white/20'
              }`}
            />
            <span className={isExhaling ? 'text-[#00E5C7]' : 'text-white/40'}>
              {isExhaling ? 'BIOLOGICAL SYSTEM EXHALING &bull; ZERO STRAIN RESTING STATE' : 'MONITORING RESPIRATION'}
            </span>
          </div>

          <div className="text-[11px] font-mono text-white/40">
            &copy; 2026 ARANEX LABS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* Easter Egg Modal (Surprise #2) */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </main>
  );
}
