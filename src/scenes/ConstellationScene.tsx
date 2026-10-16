'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ARANEX_CONTENT, ConstellationNode } from '@/content/aranexData';
import { sound } from '@/lib/soundEngine';

interface ConstellationSceneProps {
  scrollProgress: number;
  onSelectNode: (node: ConstellationNode) => void;
}

export function ConstellationScene({
  scrollProgress,
  onSelectNode,
}: ConstellationSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = ARANEX_CONTENT.section08_vision.nodes;

  const isVisible = scrollProgress >= 0.80;

  // Build connecting constellation lines
  const { linePoints } = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        points.push(...nodes[i].coordinates);
        points.push(...nodes[j].coordinates);
      }
    }
    return { linePoints: new Float32Array(points) };
  }, [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    // Gentle constellation orbit
    groupRef.current.rotation.y = time * 0.12;
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.08;
  });

  const segmentsObject = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePoints, 3));
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#00E5C7'),
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });
    return new THREE.LineSegments(geo, mat);
  }, [linePoints]);

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Constellation Network Lines */}
      <primitive object={segmentsObject} />

      {/* 2. Interactive Constellation Nodes */}
      {nodes.map((node) => {
        const [x, y, z] = node.coordinates;

        return (
          <group key={node.id} position={[x, y, z]}>
            {/* Glowing Core Sphere */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                sound.playDataPulse();
                onSelectNode(node);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshStandardMaterial
                color="#00E5C7"
                emissive="#00E5C7"
                emissiveIntensity={1.0}
                roughness={0.2}
              />
            </mesh>

            {/* Orbiting Halo Wireframe */}
            <mesh>
              <sphereGeometry args={[0.28, 16, 16]} />
              <meshBasicMaterial
                color="#58A6FF"
                wireframe
                transparent
                opacity={0.4}
              />
            </mesh>

            {/* Floating Interactive Label */}
            <Html position={[0, 0.45, 0]} center distanceFactor={7}>
              <button
                onClick={() => {
                  sound.playDataPulse();
                  onSelectNode(node);
                }}
                className="group flex flex-col items-center px-3 py-1.5 rounded-xl bg-[#0D1117]/85 border border-[#00E5C7]/40 hover:border-[#00E5C7] text-left transition-all backdrop-blur-md shadow-xl whitespace-nowrap cursor-pointer"
              >
                <span className="font-mono text-[8px] uppercase tracking-wider text-[#00E5C7]">
                  {node.status}
                </span>
                <span className="font-sans font-medium text-xs text-[#F0EFEA] group-hover:text-white">
                  {node.title}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
