'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BiomechanicsProblem } from '@/content/aranexData';

interface BiomechanicsSceneProps {
  scrollProgress: number;
  activeProblem: BiomechanicsProblem['id'];
}

export function BiomechanicsScene({
  scrollProgress,
  activeProblem,
}: BiomechanicsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const stressRingsRef = useRef<THREE.Group>(null);

  const isVisible = scrollProgress >= 0.58 && scrollProgress <= 0.78;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.2;

    if (stressRingsRef.current) {
      stressRingsRef.current.rotation.z += delta * 0.8;
      const pulse = Math.sin(time * 3.0) * 0.15 + 1.0;
      stressRingsRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  if (!isVisible) return null;

  // Problem-specific colors
  const problemColor =
    activeProblem === 'friction'
      ? '#F97316'
      : activeProblem === 'pressure'
      ? '#EF4444'
      : activeProblem === 'heat'
      ? '#E5A93C'
      : '#A855F7';

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Abstract Biomechanical Body Frame */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.65, 0.5, 1.8, 24, 16]} />
        <meshStandardMaterial
          color="#0D1117"
          roughness={0.6}
          wireframe={false}
        />
      </mesh>

      {/* Anatomical Contour Skeleton */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.67, 0.52, 1.82, 24, 16, true]} />
        <meshStandardMaterial
          color="#1F2937"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Dynamic Stress Vectors based on active problem */}
      <group ref={stressRingsRef}>
        {activeProblem === 'friction' && (
          // Friction shear rings around joint areas
          <group position={[0, -0.6, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.04, 16, 32]} />
              <meshStandardMaterial color={problemColor} emissive={problemColor} emissiveIntensity={0.8} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0.4, 0]}>
              <torusGeometry args={[0.6, 0.02, 16, 32]} />
              <meshBasicMaterial color="#FFFFFF" wireframe />
            </mesh>
          </group>
        )}

        {activeProblem === 'pressure' && (
          // Compressive vectors pushing inward
          <group position={[0, 0.6, 0]}>
            {[-0.7, 0.7].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, i === 0 ? -Math.PI / 2 : Math.PI / 2]}>
                <coneGeometry args={[0.15, 0.4, 12]} />
                <meshStandardMaterial color={problemColor} emissive={problemColor} emissiveIntensity={0.9} />
              </mesh>
            ))}
          </group>
        )}

        {activeProblem === 'heat' && (
          // Thermal convection halos radiating out
          <group position={[0, 0.3, 0]}>
            <mesh>
              <sphereGeometry args={[0.8, 20, 20]} />
              <meshBasicMaterial color={problemColor} wireframe transparent opacity={0.35} />
            </mesh>
          </group>
        )}

        {activeProblem === 'movement' && (
          // Diagonal kinetic tension band
          <mesh position={[0, 0.4, 0]} rotation={[0.4, 0.6, 0.8]}>
            <torusGeometry args={[0.75, 0.03, 16, 32]} />
            <meshStandardMaterial color={problemColor} emissive={problemColor} emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>
    </group>
  );
}
