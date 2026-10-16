'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ARANEX_CONTENT } from '@/content/aranexData';

interface OriginTimelineSceneProps {
  scrollProgress: number;
  activeItemIndex: number;
  onSelectItem: (index: number) => void;
}

export function OriginTimelineScene({
  scrollProgress,
  activeItemIndex,
  onSelectItem,
}: OriginTimelineSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const items = ARANEX_CONTENT.section01_origin.items;

  // Local section visibility
  const isVisible = scrollProgress >= 0.08 && scrollProgress <= 0.26;
  const sectionProgress = Math.max(0, Math.min(1, (scrollProgress - 0.08) / 0.18));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth horizontal camera / timeline tracking
    const targetX = -(activeItemIndex * 3.2 - 6.4);
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      delta * 3.0
    );

    // Subtle breathing float
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {items.map((item, index) => {
        const xPos = index * 3.2 - 6.4;
        const isActive = activeItemIndex === index;
        const amberColor = item.color || '#E5A93C';

        return (
          <group key={item.id} position={[xPos, 0, 0]}>
            {/* 3D Silhouettes representing each era's biomechanical adaptation */}
            <mesh
              onClick={() => onSelectItem(index)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              {index === 0 && (
                // 1420 Armour: Segmented plate geometry
                <cylinderGeometry args={[0.9, 0.7, 2.2, 8, 4]} />
              )}
              {index === 1 && (
                // 1740 Wrap: Organic tapered smock
                <coneGeometry args={[1.0, 2.3, 16, 8, true]} />
              )}
              {index === 2 && (
                // 1854 Soldier's Coat: Heavy cylindrical trench
                <cylinderGeometry args={[0.85, 0.95, 2.6, 20, 8]} />
              )}
              {index === 3 && (
                // 1905 Tailored Suit: Cinched waist geometry
                <cylinderGeometry args={[0.8, 0.65, 2.2, 24, 6]} />
              )}
              {index === 4 && (
                // 1926 Tennis Whites: Fluid athletic polo
                <capsuleGeometry args={[0.65, 1.2, 12, 24]} />
              )}

              <meshStandardMaterial
                color={isActive ? amberColor : '#1F2937'}
                wireframe={!isActive}
                emissive={isActive ? amberColor : '#0D1117'}
                emissiveIntensity={isActive ? 0.7 : 0.1}
                metalness={index === 0 ? 0.8 : 0.1}
                roughness={index === 0 ? 0.2 : 0.8}
                transparent
                opacity={isActive ? 0.9 : 0.45}
              />
            </mesh>

            {/* Orbiting Ground Anchor Ring */}
            <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.1, 1.15, 32]} />
              <meshBasicMaterial
                color={isActive ? amberColor : '#374151'}
                transparent
                opacity={isActive ? 0.8 : 0.2}
              />
            </mesh>

            {/* 3D Floating Purpose Label (Protect / Endure / Move / Perform) */}
            <Html
              position={[0, 1.6, 0]}
              center
              distanceFactor={8}
              className="pointer-events-none select-none"
            >
              <div
                className={`flex flex-col items-center transition-all duration-300 ${
                  isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
                }`}
              >
                <span className="font-mono text-[9px] text-white/50 tracking-widest uppercase">
                  {item.year}
                </span>
                <span
                  className="font-serif text-sm font-semibold tracking-wider px-2 py-0.5 rounded-full border text-center shadow-lg"
                  style={{
                    color: isActive ? amberColor : '#E5E7EB',
                    borderColor: isActive ? amberColor : 'rgba(255,255,255,0.1)',
                    backgroundColor: isActive ? 'rgba(229,169,60,0.15)' : 'rgba(5,7,10,0.8)',
                  }}
                >
                  {item.purpose.toUpperCase()}
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
