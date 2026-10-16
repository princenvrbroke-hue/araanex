'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface EasterEggGarmentSceneProps {
  wireframeColor?: string;
  wireframeOnly?: boolean;
}

export function EasterEggGarmentScene({
  wireframeColor = '#00E5C7',
  wireframeOnly = true,
}: EasterEggGarmentSceneProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[3, 5, 4]} intensity={2.0} color="#FFFFFF" />
      <pointLight position={[-3, -2, -2]} intensity={2.5} color={wireframeColor} />

      <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.8} />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={meshRef}>
          {/* Torso wireframe mesh */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.9, 0.75, 2.2, 32, 24, true]} />
            <meshStandardMaterial
              color={wireframeColor}
              wireframe={wireframeOnly}
              emissive={wireframeColor}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Left sleeve wireframe */}
          <mesh position={[-1.3, 0.6, 0]} rotation={[0, 0, Math.PI / 3.8]}>
            <cylinderGeometry args={[0.35, 0.28, 1.4, 24, 16, true]} />
            <meshStandardMaterial
              color={wireframeColor}
              wireframe={wireframeOnly}
              emissive={wireframeColor}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Right sleeve wireframe */}
          <mesh position={[1.3, 0.6, 0]} rotation={[0, 0, -Math.PI / 3.8]}>
            <cylinderGeometry args={[0.35, 0.28, 1.4, 24, 16, true]} />
            <meshStandardMaterial
              color={wireframeColor}
              wireframe={wireframeOnly}
              emissive={wireframeColor}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Collar ring */}
          <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.08, 16, 32]} />
            <meshStandardMaterial
              color="#F0EFEA"
              wireframe={wireframeOnly}
              emissive="#F0EFEA"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Pulsing core node */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#00E5C7" wireframe />
          </mesh>
        </group>
      </Float>
    </>
  );
}
