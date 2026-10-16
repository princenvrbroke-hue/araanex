'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroThreadSceneProps {
  scrollProgress: number;
  scrollVelocity: number;
  isExhaling: boolean;
}

export function HeroThreadScene({
  scrollProgress,
  scrollVelocity,
  isExhaling,
}: HeroThreadSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const garmentRef = useRef<THREE.Group>(null);

  // Custom vertex shader for interactive cloth ripple & weaving displacement
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScrollSpeed: { value: 0 },
      uExhale: { value: 0 },
      uProgress: { value: 0 },
    }),
    []
  );

  // Generate parametric 3D thread curve that loops and knits
  const { threadCurvePoints } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 300;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8;
      const radius = 1.6 + Math.sin(t * 3) * 0.4;
      const x = Math.cos(t) * radius;
      const y = (i / count) * 3.5 - 1.75;
      const z = Math.sin(t * 2) * 0.6;
      points.push(new THREE.Vector3(x, y, z));
    }
    return { threadCurvePoints: points };
  }, []);

  // Track mouse coordinates in normalized device space
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    uniforms.uTime.value = time;
    uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
    uniforms.uScrollSpeed.value = THREE.MathUtils.lerp(
      uniforms.uScrollSpeed.value,
      scrollVelocity,
      delta * 4
    );
    uniforms.uExhale.value = THREE.MathUtils.lerp(
      uniforms.uExhale.value,
      isExhaling ? 1.0 : 0.0,
      delta * 2
    );
    uniforms.uProgress.value = scrollProgress;

    // Rotate garment silhouette smoothly
    if (garmentRef.current) {
      garmentRef.current.rotation.y = time * 0.25 + scrollProgress * 2.0;

      // Scroll speed ripple effect (Surprise #3)
      const stretch = 1.0 + Math.min(scrollVelocity * 0.035, 0.4);
      const exhaleScale = isExhaling ? 1.0 + Math.sin(time * 2.0) * 0.08 : 1.0;
      garmentRef.current.scale.set(
        (1.0 / Math.sqrt(stretch)) * exhaleScale,
        stretch * exhaleScale,
        (1.0 / Math.sqrt(stretch)) * exhaleScale
      );
    }

    // Interactive thread curve animation
    if (lineObject) {
      lineObject.rotation.y = -time * 0.4;
      lineObject.rotation.z = Math.sin(time * 0.5) * 0.15;
      (lineObject.material as THREE.LineBasicMaterial).opacity = heroOpacity * 0.85;
    }
  });

  // Calculate weave visibility based on hero progress
  const heroOpacity = Math.max(0, 1 - scrollProgress * 3.5);

  const lineObject = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array(threadCurvePoints.flatMap((p) => [p.x, p.y, p.z])),
        3
      )
    );
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#00E5C7'),
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(geo, mat);
  }, [threadCurvePoints]);

  return (
    <group visible={heroOpacity > 0.01}>
      {/* 1. Single Thread of Light (Weaving filament) */}
      <primitive object={lineObject} />

      {/* 2. Knitted Garment Silhouette that assembles as user scrolls or moves mouse */}
      <group ref={garmentRef} position={[0, 0, 0]}>
        {/* Main Torso Knit Shell */}
        <mesh ref={meshRef}>
          <cylinderGeometry args={[1.1, 0.9, 2.5, 48, 32, true]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            uniforms={uniforms}
            vertexShader={`
              uniform float uTime;
              uniform vec2 uMouse;
              uniform float uScrollSpeed;
              uniform float uExhale;
              varying vec2 vUv;
              varying vec3 vNormal;
              varying vec3 vPosition;

              void main() {
                vUv = uv;
                vNormal = normal;
                vec3 pos = position;

                // Interactive cloth ripple reacting to mouse cursor
                float distToMouse = length(pos.xy - uMouse * 2.0);
                float ripple = sin(distToMouse * 8.0 - uTime * 4.0) * exp(-distToMouse * 1.5) * 0.12;

                // Kinetic stretch & ripple from fast scrolling (Surprise #3)
                float scrollWave = sin(pos.y * 6.0 + uTime * 6.0) * (uScrollSpeed * 0.018);

                // Exhale breathing motion (Surprise #6)
                float breathe = sin(uTime * 2.0) * uExhale * 0.15;

                pos += normal * (ripple + scrollWave + breathe);
                vPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `}
            fragmentShader={`
              uniform float uTime;
              uniform float uProgress;
              varying vec2 vUv;
              varying vec3 vNormal;
              varying vec3 vPosition;

              void main() {
                // Micro-knit grid lines simulating woven warp and weft
                float warp = step(0.12, fract(vUv.x * 60.0));
                float weft = step(0.12, fract(vUv.y * 50.0));
                float weavePattern = warp * weft;

                // Subtle light rim fresnel
                vec3 viewDir = normalize(-vPosition);
                float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.5);

                vec3 baseColor = mix(vec3(0.02, 0.03, 0.05), vec3(0.0, 0.9, 0.78), fresnel * 0.85);
                float alpha = (0.35 + fresnel * 0.65) * (0.4 + weavePattern * 0.6);

                gl_FragColor = vec4(baseColor, alpha * (1.0 - uProgress * 2.5));
              }
            `}
          />
        </mesh>

        {/* Floating Kinetic Collar Ring */}
        <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 16, 48]} />
          <meshStandardMaterial
            color="#00E5C7"
            emissive="#00E5C7"
            emissiveIntensity={0.8}
            transparent
            opacity={heroOpacity * 0.7}
          />
        </mesh>

        {/* Left Sleeve Drape */}
        <mesh position={[-1.4, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.42, 0.35, 1.6, 24, 16, true]} />
          <meshStandardMaterial
            color="#121820"
            wireframe
            transparent
            opacity={heroOpacity * 0.4}
          />
        </mesh>

        {/* Right Sleeve Drape */}
        <mesh position={[1.4, 0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.42, 0.35, 1.6, 24, 16, true]} />
          <meshStandardMaterial
            color="#121820"
            wireframe
            transparent
            opacity={heroOpacity * 0.4}
          />
        </mesh>
      </group>
    </group>
  );
}
