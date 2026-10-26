'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Dialog } from './ui/Dialog';
import { Eyebrow } from './ui/Eyebrow';
import { WebGLBoundary } from './ui/WebGLBoundary';
import { EasterEggGarmentScene } from '@/scenes/EasterEggGarmentScene';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="ARANEX Kinematic Wireframe"
      eyebrow={<Eyebrow text="YOU FOUND IT" />}
      className="max-w-4xl p-6 md:p-8"
    >
      <p className="mt-2 text-[14px] font-light text-[#c9d3e6] leading-relaxed">
        The pattern underneath the garment. Every face is a zone of knit tension. Drag to turn it.
      </p>
      <div className="mt-5 h-[55svh] rounded-xl overflow-hidden border border-[rgba(160,190,255,0.18)] bg-[#05080f]">
        <WebGLBoundary fallback={<p className="p-6 text-sm text-[#7f8ba3]">3D view isn&apos;t supported on this device.</p>}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <EasterEggGarmentScene wireframeColor="#5aa9ff" wireframeOnly />
        </Canvas>
        </WebGLBoundary>
      </div>
    </Dialog>
  );
}
