'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ARANEX_CONTENT, AnatomicalZone } from '@/content/aranexData';
import { sound } from '@/lib/soundEngine';

interface AnatomyScienceSceneProps {
  scrollProgress: number;
  activeZoneId: AnatomicalZone['id'];
  onSelectZone: (id: AnatomicalZone['id']) => void;
  isEngineered: boolean; // toggle: Uniform garment (false) vs Anatomically engineered (true)
  activeLayer: 'pressure' | 'friction' | 'movement' | 'ventilation';
}

export function AnatomyScienceScene({
  scrollProgress,
  activeZoneId,
  onSelectZone,
  isEngineered,
  activeLayer,
}: AnatomyScienceSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const zones = ARANEX_CONTENT.section04_anatomy.zones;

  const isVisible = scrollProgress >= 0.38 && scrollProgress <= 0.58;

  // Generate particle systems for convective airflow and sweat vaporization
  const { particlePositions, particleCount } = useMemo(() => {
    const count = 150;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return { particlePositions: pos, particleCount: count };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth subtle idle turn
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.25;

    // Camera target alignment to active zone
    const targetZone = zones.find((z) => z.id === activeZoneId);
    if (targetZone) {
      const targetPos = targetZone.position;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -targetPos[1] * 0.4,
        delta * 2.5
      );
    }

    // Animate airflow / sweat particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speed = isEngineered ? 0.035 : 0.008; // Fast laminar venting vs sluggish trapped humidity
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += speed;
        if (positions[i * 3 + 1] > 2.0) {
          positions[i * 3 + 1] = -2.0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!isVisible) return null;

  // Dynamic heat map color based on layer & engineering toggle
  const heatColor = !isEngineered
    ? activeLayer === 'pressure'
      ? '#EF4444' // Stagnant peak pressure
      : activeLayer === 'friction'
      ? '#F97316'
      : '#EAB308'
    : '#00E5C7'; // Uniform, ventilated, balanced

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* 1. X-Ray Translucent Anatomical Body */}
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial
          color="#161B22"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.65, 0.45, 1.5, 24, 16]} />
        <meshStandardMaterial
          color="#05070A"
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Glowing X-Ray ribcage / spinal spine */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.68, 0.48, 1.52, 24, 16, true]} />
        <meshStandardMaterial
          color={heatColor}
          wireframe
          emissive={heatColor}
          emissiveIntensity={isEngineered ? 0.4 : 0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Legs & Knees */}
      <mesh position={[-0.35, -1.0, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 1.8, 16, 16]} />
        <meshStandardMaterial color="#161B22" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.35, -1.0, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 1.8, 16, 16]} />
        <meshStandardMaterial color="#161B22" wireframe transparent opacity={0.5} />
      </mesh>

      {/* 2. Airflow & Sweat Particle Flows */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color={isEngineered ? '#00E5C7' : '#38BDF8'}
          transparent
          opacity={0.75}
        />
      </points>

      {/* 3. Interactive Tappable Hotspots on Anatomical Zones */}
      {zones.map((zone) => {
        const isSelected = activeZoneId === zone.id;
        const [x, y, z] = zone.position;

        return (
          <group key={zone.id} position={[x, y, z]}>
            {/* Pulsing Hotspot Node */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                sound.playResonantHum(180, 0.3);
                onSelectZone(zone.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <sphereGeometry args={[isSelected ? 0.12 : 0.08, 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? '#00E5C7' : '#FFFFFF'}
              />
            </mesh>

            {/* Glowing ripple aura */}
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? '#00E5C7' : '#58A6FF'}
                wireframe
                transparent
                opacity={isSelected ? 0.8 : 0.3}
              />
            </mesh>

            {/* Floating label */}
            <Html position={[0.3, 0.1, 0]} distanceFactor={7}>
              <button
                onClick={() => onSelectZone(zone.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#00E5C7]/20 border-[#00E5C7] text-[#00E5C7] scale-105'
                    : 'bg-[#05070A]/80 border-white/20 text-white/70 hover:text-white'
                }`}
              >
                {zone.name.toUpperCase()}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
