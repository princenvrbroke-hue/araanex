'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MacroWeaveCanvasProps {
  layerMode: 'all' | 'capillary' | 'elastomer' | 'conductive';
}

export function MacroWeaveCanvas({ layerMode }: MacroWeaveCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Generate warp and weft cylinder curves
  const numStrands = 7;
  const spacing = 0.7;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={2.5} color="#FFFFFF" />
      <pointLight position={[-4, -2, -3]} intensity={1.5} color="#00E5C7" />
      <pointLight position={[3, 4, 2]} intensity={1.2} color="#58A6FF" />

      <OrbitControls enableZoom={true} minDistance={3} maxDistance={12} enablePan={false} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={groupRef}>
          {/* Horizontal Weft Strands (Woven undulation) */}
          {Array.from({ length: numStrands }).map((_, i) => {
            const y = (i - (numStrands - 1) / 2) * spacing;
            const isConductive = i === 3;
            const isCapillary = i % 2 === 0;

            const isVisible =
              layerMode === 'all' ||
              (layerMode === 'conductive' && isConductive) ||
              (layerMode === 'capillary' && isCapillary) ||
              (layerMode === 'elastomer' && !isConductive && !isCapillary);

            if (!isVisible) return null;

            // Separate filaments if isolated
            const zSeparation = layerMode !== 'all' ? (isConductive ? 1.0 : isCapillary ? -0.8 : 0) : 0;

            return (
              <group key={`weft-${i}`} position={[0, y, zSeparation]}>
                <mesh>
                  {/* Torus knot or tube curve to simulate twisted yarn bundle */}
                  <cylinderGeometry args={[0.12, 0.12, 5, 24, 32]} />
                  <meshStandardMaterial
                    color={isConductive ? '#00E5C7' : isCapillary ? '#F0EFEA' : '#58A6FF'}
                    metalness={isConductive ? 0.9 : 0.2}
                    roughness={isConductive ? 0.1 : 0.6}
                    emissive={isConductive ? '#00E5C7' : '#000000'}
                    emissiveIntensity={isConductive ? 0.6 : 0}
                    wireframe={false}
                  />
                </mesh>
                {/* Secondary micro-filaments wound around yarn */}
                <mesh rotation={[0, 0, Math.PI / 4]}>
                  <torusGeometry args={[0.14, 0.02, 12, 24]} />
                  <meshStandardMaterial color={isConductive ? '#56FFDD' : '#94A3B8'} roughness={0.4} />
                </mesh>
              </group>
            );
          })}

          {/* Vertical Warp Strands */}
          {Array.from({ length: numStrands }).map((_, j) => {
            const x = (j - (numStrands - 1) / 2) * spacing;
            const isConductive = j === 3;
            const isCapillary = j % 2 === 1;

            const isVisible =
              layerMode === 'all' ||
              (layerMode === 'conductive' && isConductive) ||
              (layerMode === 'capillary' && isCapillary) ||
              (layerMode === 'elastomer' && !isConductive && !isCapillary);

            if (!isVisible) return null;

            const zSeparation = layerMode !== 'all' ? (isConductive ? 0.8 : isCapillary ? -0.6 : 0.2) : 0;

            return (
              <group key={`warp-${j}`} position={[x, 0, zSeparation]} rotation={[0, 0, Math.PI / 2]}>
                <mesh>
                  <cylinderGeometry args={[0.11, 0.11, 5, 24, 32]} />
                  <meshStandardMaterial
                    color={isConductive ? '#00E5C7' : isCapillary ? '#E2E8F0' : '#E5A93C'}
                    metalness={isConductive ? 0.9 : 0.3}
                    roughness={isConductive ? 0.1 : 0.5}
                    emissive={isConductive ? '#00E5C7' : '#000000'}
                    emissiveIntensity={isConductive ? 0.7 : 0}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </Float>
    </>
  );
}
