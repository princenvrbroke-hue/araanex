'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Archetype, ARANEX_CONTENT } from '@/content/aranexData';

interface PerformanceSceneProps {
  scrollProgress: number;
  activeArchetype: Archetype['id'];
}

export function PerformanceScene({
  scrollProgress,
  activeArchetype,
}: PerformanceSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const isVisible = scrollProgress >= 0.18 && scrollProgress <= 0.38;
  const currentArchetype =
    ARANEX_CONTENT.section02_performance.archetypes.find(
      (a) => a.id === activeArchetype
    ) || ARANEX_CONTENT.section02_performance.archetypes[0];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const lerpSpeed = Math.min(1, delta * 3.5);
    const time = state.clock.elapsedTime;

    // Gentle anatomical float & rotation
    groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.3;

    // Posture morphing based on occupational demands
    if (activeArchetype === 'soldier') {
      // Braced, rigid stance
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.2, lerpSpeed);
      if (torsoRef.current) torsoRef.current.scale.set(1.15, 1.0, 1.15);
      if (headRef.current) headRef.current.position.set(0, 1.45, 0.05);
    } else if (activeArchetype === 'professional') {
      // Forward head posture & thoracic slouch
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.4, lerpSpeed);
      if (torsoRef.current) torsoRef.current.scale.set(0.95, 0.9, 0.95);
      if (headRef.current) headRef.current.position.set(0, 1.35, 0.2);
    } else if (activeArchetype === 'worker') {
      // Flexed articulation
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.3, lerpSpeed);
      if (torsoRef.current) torsoRef.current.scale.set(1.05, 0.95, 1.05);
      if (headRef.current) headRef.current.position.set(0, 1.4, 0.1);
    } else if (activeArchetype === 'athlete') {
      // Kinetic aerodynamic extension
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.0, lerpSpeed);
      if (torsoRef.current) torsoRef.current.scale.set(1.0, 1.05, 0.95);
      if (headRef.current) headRef.current.position.set(0, 1.5, -0.05);
    }
  });

  if (!isVisible) return null;

  const primaryCol = currentArchetype.primaryColor;
  const accentCol = currentArchetype.accentColor;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color={primaryCol}
          wireframe
          emissive={primaryCol}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Torso & Core Mannequin */}
      <mesh ref={torsoRef} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 1.6, 24, 16]} />
        <meshStandardMaterial
          color="#0D1117"
          roughness={0.4}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Overlaid Stress & Thermal Ring Mesh */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.72, 0.52, 1.62, 24, 16, true]} />
        <meshStandardMaterial
          color={accentCol}
          wireframe
          emissive={accentCol}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Clavicle & Shoulder Span */}
      <mesh position={[0, 1.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.15, 1.4, 12, 16]} />
        <meshStandardMaterial color={primaryCol} emissive={primaryCol} emissiveIntensity={0.5} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.95, 0.45, 0]}>
        <capsuleGeometry args={[0.14, 1.2, 12, 16]} />
        <meshStandardMaterial color="#1F2937" wireframe />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.95, 0.45, 0]}>
        <capsuleGeometry args={[0.14, 1.2, 12, 16]} />
        <meshStandardMaterial color="#1F2937" wireframe />
      </mesh>

      {/* Pelvis & Hip Base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.48, 0.5, 20, 8]} />
        <meshStandardMaterial color={primaryCol} wireframe />
      </mesh>

      {/* Kinetic Stress Concentrator Rings (Highlighting high-stress zones) */}
      <group position={[0, 0.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.02, 12, 32]} />
          <meshBasicMaterial color={accentCol} />
        </mesh>
      </group>
    </group>
  );
}
