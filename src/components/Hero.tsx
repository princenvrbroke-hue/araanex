'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HeroScrollSequence } from '@/components/hero/HeroScrollSequence';
import { HeroCallouts } from '@/components/hero/HeroCallouts';
import { sound } from '@/lib/soundEngine';

// Transparent 3D ribbon layer over the plate (client-only)
const HeroRibbon3D = dynamic(
  () => import('@/components/hero/HeroRibbon3D').then((m) => m.default),
  { ssr: false }
);

interface HeroProps {
  onExploreScience: () => void;
  onFutureVision: () => void;
}

export function Hero({ onExploreScience, onFutureVision }: HeroProps) {
  const reducedMotion = useReducedMotion() ?? false;

  const plateRef = useRef<HTMLDivElement>(null);

  // Outer tall (pinned) section + static-composition overlays (3D ribbon,
  // callouts) that the scroll sequence fades out
  const heroSectionRef = useRef<HTMLElement>(null);
  const ribbonFadeRef = useRef<HTMLDivElement>(null);
  const calloutFadeRef = useRef<HTMLDivElement>(null);

  // Normalized mouse for the 3D layer (kept in a ref: no re-renders)
  const parallaxRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      parallaxRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      parallaxRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  return (
    <section
      id="section-0"
      ref={heroSectionRef}
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative h-[280svh] w-full z-10 outline-none"
    >
      <div className="sticky top-0 h-[100svh] flex items-start lg:items-center pt-[96px] lg:pt-24 pb-6 lg:pb-12 px-6 md:px-12 xl:pl-[104px] max-w-[1536px] mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 items-center lg:min-h-[calc(100svh-120px)]">
          {/* ── Left column: eyebrow, two-tone headline, copy, CTAs ── */}
          <div className="lg:col-span-5 space-y-4 lg:space-y-6 z-20 max-w-[640px]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow prefix="ARAANEX /" text="THE SCIENCE OF WEARABLES" />
            </motion.div>

            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[clamp(32px,3.05vw,50px)] font-normal tracking-[-0.015em] leading-[1.12]"
            >
              <span className="block text-white">For Centuries,</span>
              <span className="block text-white">We Have Worn Clothes.</span>
              <span className="block text-gradient-title">It&apos;s Time Our Clothes</span>
              <span className="block text-gradient-title">Did More for Us.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22 }}
              className="text-[15px] md:text-[18px] font-light text-[#c9d3e6] leading-[1.5] space-y-0.5"
            >
              <p>From protection to performance.</p>
              <p>From comfort to intelligent functionality.</p>
              <p className="hidden sm:block">Discover how science is redefining what we wear.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="flex flex-wrap items-center gap-3 lg:gap-4 pt-1 lg:pt-3"
            >
              <button
                type="button"
                onClick={() => {
                  sound.playTick(750, 0.04);
                  onExploreScience();
                }}
                className="group btn-pill-primary"
              >
                <span>Explore the Science</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playTick(600, 0.03);
                  onFutureVision();
                }}
                className="btn-pill-secondary"
              >
                Our Future Vision
              </button>
            </motion.div>
          </div>

          {/* ── Right column: 16:9 orbit-sequence stage with ribbon + callouts ── */}
          <div className="lg:col-span-7 relative h-[30svh] md:h-[480px] lg:h-[min(78vh,720px)] select-none flex items-center">
            {/* Sequence stage: 16:9 box at the column's full width. The canvas
                fills it at source resolution — never upscaled. */}
            <div ref={plateRef} className="relative w-full aspect-video">
              {/* Ambient bleed: extends the video's own blue-gray ambient tone
                  OUT onto the page behind the stage so the box edge never faces
                  a darker page tone. Kept behind the canvas (DOM order). */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none"
                style={{
                  inset: '-130px -110px',
                  background:
                    'radial-gradient(ellipse at 50% 48%, rgba(22,40,76,0.12) 45%, rgba(14,24,46,0.06) 70%, rgba(12,20,38,0) 88%)',
                }}
              />
              <HeroScrollSequence
                sectionRef={heroSectionRef}
                stageRef={plateRef}
                fadeRefs={[ribbonFadeRef, calloutFadeRef]}
              />
            </div>

            {/* 3D woven ribbon wrapped around the stage (edge-feathered so
                strand tails never visibly end mid-air; fades out as the
                scroll orbit begins) */}
            <div
              ref={ribbonFadeRef}
              className="absolute inset-0 z-10"
              aria-hidden="true"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0, black 7%, black 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            >
              <HeroRibbon3D parallaxRef={parallaxRef} reducedMotion={reducedMotion} />
            </div>

            {/* Annotations: callouts + leader lines (fade with the ribbon) */}
            <div ref={calloutFadeRef} className="absolute inset-0 z-20">
              <HeroCallouts plateRef={plateRef} />
            </div>
          </div>
        </div>

        {/* Light ambient glow behind the plate */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute right-[8%] top-1/3 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[#2f6fe0]/10 blur-[110px] pointer-events-none"
        />
      </div>
    </section>
  );
}
