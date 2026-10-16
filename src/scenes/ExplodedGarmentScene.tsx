'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ARANEX_CONTENT, ExplodedLayer } from '@/content/aranexData';

interface ExplodedGarmentSceneProps {
  scrollProgress: number;
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
}

export function ExplodedGarmentScene({
  scrollProgress,
  activeLayerId,
  onSelectLayer,
}: ExplodedGarmentSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const layers = ARANEX_CONTENT.section05_aranex.layers;

  const isVisible = scrollProgress >= 0.48 && scrollProgress <= 0.68;
  // Local scrub progress 0 -> 1 within section
  const scrubProgress = Math.max(0, Math.min(1, (scrollProgress - 0.48) / 0.20));

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Slow rotational perspective
    groupRef.current.rotation.y = 0.45 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    groupRef.current.rotation.x = 0.1;
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {layers.map((layer) => {
        const isSelected = activeLayerId === layer.id;
        // Scrub the Z separation distance dynamically
        const currentZ = layer.zOffset * (0.3 + scrubProgress * 1.8);

        return (
          <group key={layer.id} position={[0, 0, currentZ]}>
            {/* Layer 3D Shell Geometry */}
            <mesh
              onClick={() => onSelectLayer(layer.id)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <cylinderGeometry args={[0.85, 0.7, 2.0, 32, 16, true]} />
              <meshStandardMaterial
                color={layer.color}
                wireframe={!isSelected && layer.level !== 1}
                emissive={layer.color}
                emissiveIntensity={isSelected ? 0.8 : 0.2}
                transparent
                opacity={isSelected ? 0.95 : 0.6}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Layer Halo Frame */}
            <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.86, 0.015, 12, 32]} />
              <meshBasicMaterial color={layer.color} />
            </mesh>

            {/* Floating Layer Hotspot Callout */}
            <Html position={[1.1, 0.2, 0]} distanceFactor={7}>
              <button
                onClick={() => onSelectLayer(layer.id)}
                className={`px-3 py-1.5 rounded-xl border text-left transition-all backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#0D1117]/95 border-[#00E5C7] shadow-[0_0_15px_rgba(0,229,199,0.3)] scale-105'
                    : 'bg-[#05070A]/80 border-white/10 hover:border-white/30 text-white/70'
                }`}
              >
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#00E5C7]">
                  <span>LAYER 0{layer.level}</span>
                  <span>&bull;</span>
                  <span>{layer.engineeringRole.split(' ')[0]}</span>
                </div>
                <div className="font-sans font-medium text-xs text-[#F0EFEA] whitespace-nowrap">
                  {layer.name}
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
