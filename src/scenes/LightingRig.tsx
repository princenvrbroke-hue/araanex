'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightingPreset } from '@/hooks/useTimeOfDay';

interface LightingRigProps {
  preset: LightingPreset;
  activeSection: number;
}

export function LightingRig({ preset, activeSection }: LightingRigProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state, delta) => {
    const lerpSpeed = Math.min(1, delta * 3.5);

    // Warm amber boost during Chapter 01 (Origin timeline)
    const isOrigin = activeSection === 1;
    const isSensingFuture = activeSection === 7;

    const targetAmbient = new THREE.Color(
      isOrigin ? '#261C12' : isSensingFuture ? '#051C1A' : preset.ambientColor
    );
    const targetDir = new THREE.Color(
      isOrigin ? '#E5A93C' : isSensingFuture ? '#00E5C7' : preset.dirLightColor
    );
    const targetDirIntensity = isOrigin ? 2.8 : preset.dirLightIntensity;

    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbient, lerpSpeed);
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        preset.ambientIntensity,
        lerpSpeed
      );
    }

    if (dirLightRef.current) {
      dirLightRef.current.color.lerp(targetDir, lerpSpeed);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetDirIntensity,
        lerpSpeed
      );
      dirLightRef.current.position.lerp(
        new THREE.Vector3(...preset.dirLightPosition),
        lerpSpeed
      );
    }

    if (rimLightRef.current) {
      const rimTarget = new THREE.Color(
        isOrigin ? '#AA6720' : isSensingFuture ? '#56FFDD' : preset.rimColor
      );
      rimLightRef.current.color.lerp(rimTarget, lerpSpeed);
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        preset.rimIntensity,
        lerpSpeed
      );
    }

    if (pointLightRef.current) {
      // Gentle breathing light
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.3 + 1.2;
      pointLightRef.current.intensity = breathe;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={preset.ambientIntensity} />
      <directionalLight
        ref={dirLightRef}
        position={preset.dirLightPosition}
        intensity={preset.dirLightIntensity}
        castShadow={false}
      />
      <directionalLight
        ref={rimLightRef}
        position={[-preset.dirLightPosition[0], -preset.dirLightPosition[1], -4]}
        intensity={preset.rimIntensity}
      />
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 4]}
        color="#00E5C7"
        intensity={1.0}
        distance={12}
      />
    </>
  );
}
