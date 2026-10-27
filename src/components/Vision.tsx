'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from './ui/Eyebrow';
import { sound } from '@/lib/soundEngine';

interface VisionProps {
  onOpenResearch?: () => void;
}

export function Vision({ onOpenResearch }: VisionProps) {
  return (
    <section
      id="section-5"
      tabIndex={-1}
      aria-labelledby="vision-title"
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 overflow-hidden z-10 outline-none"
    >
      {/* Full-bleed dim lab scene */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/img/lab.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right brightness-[0.85] contrast-[1.1]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #05080f 28%, rgba(5,8,15,0.55) 55%, rgba(5,8,15,0.15) 100%), linear-gradient(180deg, #0a0f1a 0%, transparent 15%, transparent 85%, #05080f 100%)',
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[280px] h-[280px] bg-[#5aa9ff]/15 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-[12%] w-[180px] h-[180px] bg-[#8cc4ff]/10 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 md:px-12 xl:pl-[104px] my-auto">
        <div className="max-w-[560px] space-y-5">
          <Eyebrow text="OUR VISION" />

          <h2 id="vision-title" className="section-title">
            Science Today.
            <br />
            <span className="text-gradient-title">Healthier Tomorrows.</span>
          </h2>

          <p className="text-[15px] md:text-[16px] font-light text-[#c9d3e6] leading-[1.55]">
            We envision a future where apparel is developed with the same rigour as advanced technologies — bridging scientific research and everyday wearability.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playTick(700, 0.02);
                onOpenResearch?.();
              }}
              aria-haspopup="dialog"
              className="btn-pill-secondary"
            >
              <span>Our Research</span>
              <ArrowRight size={16} className="text-[#8cc4ff]" />
            </button>
          </div>

          <dl className="pt-6 grid grid-cols-3 gap-4 border-t border-[rgba(160,190,255,0.18)] max-w-md">
            <div>
              <dt className="sr-only">Peer-reviewed studies</dt>
              <dd className="text-2xl font-light text-white">14+</dd>
              <dd aria-hidden="true" className="text-[11px] text-[#7f8ba3] mt-0.5">Peer-Reviewed Studies</dd>
            </div>
            <div>
              <dt className="sr-only">Fatigue reduction</dt>
              <dd className="text-2xl font-light text-[#8cc4ff]">38%</dd>
              <dd aria-hidden="true" className="text-[11px] text-[#7f8ba3] mt-0.5">Fatigue Reduction</dd>
            </div>
            <div>
              <dt className="sr-only">Kinetic articulation</dt>
              <dd className="text-2xl font-light text-[#5aa9ff]">0-Seam</dd>
              <dd aria-hidden="true" className="text-[11px] text-[#7f8ba3] mt-0.5">Kinetic Articulation</dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="relative z-10 max-w-[1536px] w-full mx-auto px-6 md:px-12 xl:pl-[104px] pt-6 border-t border-[rgba(160,190,255,0.12)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7f8ba3]">
        <div className="flex items-center gap-3">
          <span className="tracking-[0.3em] font-normal text-white uppercase text-[13px]">ARAANEX</span>
          <span aria-hidden="true">•</span>
          <span>THE SCIENCE OF WEARABLES</span>
        </div>
        <button
          type="button"
          onClick={() => onOpenResearch?.()}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Scientific Whitepapers
        </button>
        <span>&copy; 2026 ARAANEX LABS INC. ALL RIGHTS RESERVED.</span>
      </footer>
    </section>
  );
}
