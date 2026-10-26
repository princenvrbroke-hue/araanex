'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { CursorTrail } from '@/components/CursorTrail';
import { Header } from '@/components/Header';
import { ChapterRail } from '@/components/ChapterRail';
import { Hero } from '@/components/Hero';
import { EvolutionTimeline } from '@/components/EvolutionTimeline';
import { AnatomyExplorer } from '@/components/AnatomyExplorer';
import { ExplodedMaterialsView } from '@/components/ExplodedMaterialsView';
import { FutureBiometrics } from '@/components/FutureBiometrics';
import { Vision } from '@/components/Vision';
import { ResearchModal } from '@/components/ResearchModal';
import { ARANEX_CONTENT } from '@/content/aranexData';
import { sound } from '@/lib/soundEngine';

// Only fetched if someone finds it
const EasterEggModal = dynamic(
  () => import('@/components/EasterEggModal').then((m) => m.EasterEggModal),
  { ssr: false }
);

export default function AranexExperience() {
  const { activeSection, scrollToSection } = useScrollProgress();

  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  const handleOpenResearch = useCallback(() => {
    sound.playDataPulse();
    setIsResearchOpen(true);
  }, []);
  const closeResearch = useCallback(() => setIsResearchOpen(false), []);
  const closeEasterEgg = useCallback(() => setIsEasterEggOpen(false), []);

  return (
    <main className="relative min-h-screen bg-[#0a0f1a] text-white overflow-x-clip">
      {/* Cursor light-thread trail */}
      <CursorTrail />

      {/* Atmospheric background plate: radial vignette + misty horizon */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 60% 40%, rgba(40,80,160,0.18), transparent 60%), linear-gradient(180deg, #05080f 0%, #0a0f1a 50%, #05080f 100%)',
          }}
        />
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[38vh] text-[#05080f] opacity-80"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,218.7C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      <Header
        activeSection={activeSection}
        onSelectSection={scrollToSection}
        onOpenResearch={handleOpenResearch}
        onSecret={() => setIsEasterEggOpen(true)}
      />

      <ChapterRail activeSection={activeSection} onSelect={scrollToSection} />

      <Hero
        onExploreScience={() => scrollToSection(2)}
        onFutureVision={() => scrollToSection(4)}
      />
      <EvolutionTimeline />
      <AnatomyExplorer />
      <ExplodedMaterialsView />
      <FutureBiometrics onExploreFuture={() => scrollToSection(5)} />
      <Vision onOpenResearch={handleOpenResearch} />

      <ResearchModal
        nodes={ARANEX_CONTENT.section08_vision.nodes}
        isOpen={isResearchOpen}
        onClose={closeResearch}
      />

      {isEasterEggOpen && <EasterEggModal isOpen onClose={closeEasterEgg} />}
    </main>
  );
}
