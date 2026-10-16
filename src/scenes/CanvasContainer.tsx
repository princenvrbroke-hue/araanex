'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightingRig } from './LightingRig';
import { HeroThreadScene } from './HeroThreadScene';
import { OriginTimelineScene } from './OriginTimelineScene';
import { PerformanceScene } from './PerformanceScene';
import { PoloEvolutionScene } from './PoloEvolutionScene';
import { AnatomyScienceScene } from './AnatomyScienceScene';
import { ExplodedGarmentScene } from './ExplodedGarmentScene';
import { BiomechanicsScene } from './BiomechanicsScene';
import { FutureSensingScene } from './FutureSensingScene';
import { ConstellationScene } from './ConstellationScene';
import { LightingPreset } from '@/hooks/useTimeOfDay';
import { Archetype, AnatomicalZone, BiomechanicsProblem, ConstellationNode } from '@/content/aranexData';

interface CanvasContainerProps {
  scrollProgress: number;
  scrollVelocity: number;
  activeSection: number;
  isExhaling: boolean;
  lightingPreset: LightingPreset;
  activeOriginItem: number;
  onSelectOriginItem: (index: number) => void;
  activeArchetype: Archetype['id'];
  poloSliderValue: number;
  activeAnatomyZone: AnatomicalZone['id'];
  onSelectAnatomyZone: (id: AnatomicalZone['id']) => void;
  isAnatomyEngineered: boolean;
  anatomyLayer: 'pressure' | 'friction' | 'movement' | 'ventilation';
  activeExplodedLayer: string;
  onSelectExplodedLayer: (id: string) => void;
  activeProblem: BiomechanicsProblem['id'];
  onSelectConstellationNode: (node: ConstellationNode) => void;
}

function CameraRig({
  scrollProgress,
  activeSection,
}: {
  scrollProgress: number;
  activeSection: number;
}) {
  useFrame((state, delta) => {
    const camera = state.camera;
    const lerpSpeed = Math.min(1, delta * 3.0);

    // Dynamic Camera Trajectory driving the story arc
    let targetPos = new THREE.Vector3(0, 0, 5.5);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (activeSection === 0) {
      // Hero: Head-on perspective
      targetPos.set(0, 0, 5.2);
    } else if (activeSection === 1) {
      // 01 Origin: Horizontal timeline panning
      targetPos.set(0, 0.2, 5.8);
    } else if (activeSection === 2) {
      // 02 Performance: Slightly lower heroic angle
      targetPos.set(0, 0.4, 5.0);
    } else if (activeSection === 3) {
      // 03 Polo: Close quarter three-quarter view
      targetPos.set(0.4, 0.2, 4.6);
    } else if (activeSection === 4) {
      // 04 Anatomy: Centered anatomical analysis
      targetPos.set(0, 0, 5.2);
    } else if (activeSection === 5) {
      // 05 Exploded View: Angled perspective to showcase Z separation
      targetPos.set(-0.8, 0.3, 5.6);
    } else if (activeSection === 6) {
      // 06 Biomechanics: Focused kinetic view
      targetPos.set(0, 0.1, 5.0);
    } else if (activeSection === 7) {
      // 07 Future Sensing: Dramatic wide pullback as sensing network wakes up
      targetPos.set(0, 0.5, 6.2);
    } else if (activeSection === 8) {
      // 08 Constellation: Elevated ascending camera over the nodes
      targetPos.set(0, 1.8, 6.8);
      targetLook.set(0, 0.2, 0);
    }

    camera.position.lerp(targetPos, lerpSpeed);
    camera.lookAt(targetLook);
  });

  return null;
}

export function CanvasContainer(props: CanvasContainerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]} // Adaptive DPR for mid-range laptops & mobile
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <CameraRig
          scrollProgress={props.scrollProgress}
          activeSection={props.activeSection}
        />

        <LightingRig
          preset={props.lightingPreset}
          activeSection={props.activeSection}
        />

        {/* 00 HERO THREAD SCENE */}
        <HeroThreadScene
          scrollProgress={props.scrollProgress}
          scrollVelocity={props.scrollVelocity}
          isExhaling={props.isExhaling}
        />

        {/* 01 THE ORIGIN TIMELINE */}
        <OriginTimelineScene
          scrollProgress={props.scrollProgress}
          activeItemIndex={props.activeOriginItem}
          onSelectItem={props.onSelectOriginItem}
        />

        {/* 02 CLOTHING & PERFORMANCE */}
        <PerformanceScene
          scrollProgress={props.scrollProgress}
          activeArchetype={props.activeArchetype}
        />

        {/* 03 THE POLO SHIRT */}
        <PoloEvolutionScene
          scrollProgress={props.scrollProgress}
          sliderValue={props.poloSliderValue}
        />

        {/* 04 THE SCIENCE OF WHAT WE WEAR */}
        <AnatomyScienceScene
          scrollProgress={props.scrollProgress}
          activeZoneId={props.activeAnatomyZone}
          onSelectZone={props.onSelectAnatomyZone}
          isEngineered={props.isAnatomyEngineered}
          activeLayer={props.anatomyLayer}
        />

        {/* 05 THE ARANEX APPROACH (EXPLODED VIEW) */}
        <ExplodedGarmentScene
          scrollProgress={props.scrollProgress}
          activeLayerId={props.activeExplodedLayer}
          onSelectLayer={props.onSelectExplodedLayer}
        />

        {/* 06 BEYOND COMFORT (BIOMECHANICS) */}
        <BiomechanicsScene
          scrollProgress={props.scrollProgress}
          activeProblem={props.activeProblem}
        />

        {/* 07 THE FUTURE (SENSING TEXTILES) */}
        <FutureSensingScene scrollProgress={props.scrollProgress} />

        {/* 08 OUR VISION (CONSTELLATION) */}
        <ConstellationScene
          scrollProgress={props.scrollProgress}
          onSelectNode={props.onSelectConstellationNode}
        />
      </Canvas>
    </div>
  );
}
