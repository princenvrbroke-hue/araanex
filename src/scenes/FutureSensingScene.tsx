'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface FutureSensingSceneProps {
  scrollProgress: number;
}

export function FutureSensingScene({ scrollProgress }: FutureSensingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dataPointsRef = useRef<THREE.Points>(null);

  const isVisible = scrollProgress >= 0.68 && scrollProgress <= 0.88;
  const sectionProgress = Math.max(0, Math.min(1, (scrollProgress - 0.68) / 0.20));

  // Generate conductive fiber data pulse nodes
  const { pulsePositions, pulseCount } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 6;
      const r = 0.85 + Math.sin(theta * 2) * 0.1;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (i / count) * 2.4 - 1.2;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return { pulsePositions: pos, pulseCount: count };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Slow rotation
    groupRef.current.rotation.y = time * 0.35;

    // Camera pullback effect: scale down or push back as section unfolds into full living network
    const pullBackScale = THREE.MathUtils.lerp(1.2, 0.85, sectionProgress);
    groupRef.current.scale.set(pullBackScale, pullBackScale, pullBackScale);

    // Animate data pulses along fibres
    if (dataPointsRef.current) {
      const positions = dataPointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pulseCount; i++) {
        // Spiral pulses up the garment
        positions[i * 3 + 1] += 0.02;
        if (positions[i * 3 + 1] > 1.2) {
          positions[i * 3 + 1] = -1.2;
        }
      }
      dataPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* 1. Underlying Bio-Responsive Garment Shell */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.75, 2.4, 36, 24, true]} />
        <meshStandardMaterial
          color="#05070A"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Conductive Carbon Nanotube / Silver Yarn Grid */}
      <mesh>
        <cylinderGeometry args={[0.91, 0.76, 2.41, 36, 24, true]} />
        <meshStandardMaterial
          color="#00E5C7"
          wireframe
          emissive="#00E5C7"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 3. Travelling Data Pulse Packets along fibers */}
      <points ref={dataPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#56FFDD"
          transparent
          opacity={0.95}
        />
      </points>

      {/* 4. Minimalist Holographic 3D Readout HUD */}
      <Html position={[1.4, 0.4, 0]} distanceFactor={6} center>
        <div className="p-3.5 rounded-xl bg-[#0D1117]/90 border border-[#00E5C7]/50 shadow-[0_0_25px_rgba(0,229,199,0.3)] backdrop-blur-xl space-y-2 text-left pointer-events-none select-none min-w-[210px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#00E5C7] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5C7] animate-ping" />
              SENSORY MATRIX ACTIVE
            </span>
            <span className="font-mono text-[9px] text-white/40">240 Hz</span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-white/50">SKIN TEMP:</span>
              <span className="text-[#F0EFEA] font-semibold">36.8°C <span className="text-[#00E5C7] text-[9px]">±0.02</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">KIN-STRAIN:</span>
              <span className="text-[#00E5C7]">0.042 &Delta;L/L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">RESPIRATION:</span>
              <span className="text-[#F0EFEA]">14 BPM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">IMPEDANCE:</span>
              <span className="text-[#58A6FF]">2.4 k&Omega;</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10">
            <div className="text-[8px] font-mono text-purple-300 uppercase tracking-widest">
              FUTURE RESEARCH ARCHITECTURE
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
