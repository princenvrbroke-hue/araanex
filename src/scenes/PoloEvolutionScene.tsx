'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PoloEvolutionSceneProps {
  scrollProgress: number;
  sliderValue: number; // 0 = 1920s starched, 1 = modern polo
}

export function PoloEvolutionScene({
  scrollProgress,
  sliderValue,
}: PoloEvolutionSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftSleeveRef = useRef<THREE.Mesh>(null);
  const rightSleeveRef = useRef<THREE.Mesh>(null);
  const collarRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  const isVisible = scrollProgress >= 0.28 && scrollProgress <= 0.48;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const lerpSpeed = Math.min(1, delta * 4.0);

    // Subtle gentle turn
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

    // Sleeve morphing: Long rigid sleeve (1.5 length) down to short athletic sleeve (0.6 length)
    const sleeveLength = THREE.MathUtils.lerp(1.5, 0.6, sliderValue);
    const sleevePos = THREE.MathUtils.lerp(-0.7, -0.3, sliderValue);

    if (leftSleeveRef.current) {
      leftSleeveRef.current.scale.set(1, sleeveLength, 1);
      leftSleeveRef.current.position.y = sleevePos;
    }
    if (rightSleeveRef.current) {
      rightSleeveRef.current.scale.set(1, sleeveLength, 1);
      rightSleeveRef.current.position.y = sleevePos;
    }

    // Collar morphing: High starched collar down to soft ribbed sports collar
    if (collarRef.current) {
      collarRef.current.scale.set(
        THREE.MathUtils.lerp(0.8, 1.1, sliderValue),
        THREE.MathUtils.lerp(1.4, 0.6, sliderValue),
        THREE.MathUtils.lerp(0.8, 1.1, sliderValue)
      );
    }
  });

  if (!isVisible) return null;

  const isModern = sliderValue > 0.5;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Garment Main Body */}
      <mesh ref={bodyRef} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.75, 0.65, 1.8, 24, 16]} />
        <meshStandardMaterial
          color={isModern ? '#F0EFEA' : '#D1D5DB'}
          roughness={isModern ? 0.8 : 0.3}
          metalness={0.05}
          wireframe={false}
        />
      </mesh>

      {/* Honeycomb porous texture overlay for modern pique */}
      {sliderValue > 0.3 && (
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.76, 0.66, 1.82, 32, 24, true]} />
          <meshStandardMaterial
            color="#00E5C7"
            wireframe
            transparent
            opacity={(sliderValue - 0.3) * 0.5}
          />
        </mesh>
      )}

      {/* Collar Geometry */}
      <group position={[0, 1.15, 0]}>
        <mesh ref={collarRef}>
          <cylinderGeometry args={[0.35, 0.4, 0.4, 20, 4, true]} />
          <meshStandardMaterial
            color={sliderValue < 0.5 ? '#9CA3AF' : '#00E5C7'}
            roughness={0.5}
          />
        </mesh>

        {/* 3D Callout Pin for Collar */}
        <Html position={[0.7, 0.2, 0]} center distanceFactor={7}>
          <div className="px-2.5 py-1 rounded bg-[#0D1117]/90 border border-white/20 text-[10px] font-mono text-white/80 whitespace-nowrap backdrop-blur-md">
            {sliderValue < 0.5 ? 'Starched High Collar (Traps Heat)' : 'Ribbed Soft Collar (Convective Venting)'}
          </div>
        </Html>
      </group>

      {/* Left Sleeve */}
      <group position={[-0.95, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh ref={leftSleeveRef} position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 1, 16]} />
          <meshStandardMaterial color={isModern ? '#F0EFEA' : '#D1D5DB'} roughness={0.7} />
        </mesh>

        {/* 3D Callout Pin for Sleeve */}
        <Html position={[-0.7, -0.4, 0]} center distanceFactor={7}>
          <div className="px-2.5 py-1 rounded bg-[#0D1117]/90 border border-white/20 text-[10px] font-mono text-white/80 whitespace-nowrap backdrop-blur-md">
            {sliderValue < 0.5 ? 'Buttoned Cuff (Arm Resistance)' : 'Short Piqué Sleeve (360° Humeral Freedom)'}
          </div>
        </Html>
      </group>

      {/* Right Sleeve */}
      <group position={[0.95, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh ref={rightSleeveRef} position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 1, 16]} />
          <meshStandardMaterial color={isModern ? '#F0EFEA' : '#D1D5DB'} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
