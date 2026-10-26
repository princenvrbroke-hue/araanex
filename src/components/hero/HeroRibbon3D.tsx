'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { createRibbonTexture } from './ribbonTexture';

/**
 * The hero 3D layer: a transparent R3F canvas laid over the photoreal mannequin
 * plate. Two woven-mesh ribbon strands (screen-fitted via a fov-mapped helper)
 * flutter and drift around the figure, with sparse glowing particles.
 * Camera can also receive a gentle mouse parallax from the caller.
 */

type Parallax = { current: { x: number; y: number } };

function buildIndices(steps: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < steps - 1; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, b, c);
    indices.push(b, d, c);
  }
  return indices;
}

function buildRibbon(
  anchors: [number, number, number][],
  worldHalfW: number,
  worldHalfH: number,
  widthScale: number
) {
  const world = anchors.map(([nx, ny, nz]) => new THREE.Vector3(nx * worldHalfW, ny * worldHalfH, nz));
  const curve = new THREE.CatmullRomCurve3(world, false, 'centripetal', 0.5);
  const steps = 180;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(steps * 2 * 3);
  const uvs = new Float32Array(steps * 2 * 2);
  const curvePoints = curve.getPoints(steps - 1);
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const p = curvePoints[i];
    const tangent = curve.getTangent(t).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (binormal.lengthSq() < 0.001) binormal.set(1, 0, 0);

    // Wider along the body sweep, tapered at the tails — filament-thin so the
    // 3D overlay reads as living light, not fake cloth (the baked plate is the cloth)
    const width = (0.05 + Math.sin(t * Math.PI) * 0.075) * widthScale;
    const p1 = p.clone().addScaledVector(binormal, width);
    const p2 = p.clone().addScaledVector(binormal, -width);

    positions.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z], i * 6);
    uvs.set([t, 0, t, 1], i * 4);
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(buildIndices(steps));
  geom.computeVertexNormals();
  return { geometry: geom, initialPositions: positions.slice() };
}

interface RibbonProps {
  worldHalfH: number;
  worldHalfW: number;
  /** Normalized anchor points: [nx, ny, nz] in -1..1 screen space */
  anchors: [number, number, number][];
  widthScale?: number;
  opacity?: number;
  speed?: number;
  phase?: number;
  parallax: Parallax;
}

function Ribbon({
  worldHalfH,
  worldHalfW,
  anchors,
  widthScale = 1,
  opacity = 0.85,
  speed = 1,
  phase = 0,
  parallax,
}: RibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createRibbonTexture(), []);
  const { geometry, initialPositions } = useMemo(
    () => buildRibbon(anchors, worldHalfW, worldHalfH, widthScale),
    [anchors, worldHalfW, worldHalfH, widthScale]
  );

  useFrame((state) => {
    // Everything mutated here is read off the mesh, never off hook values
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime * speed + phase;
    const pos = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < pos.count; i++) {
      const ox = initialPositions[i * 3 + 0];
      const oy = initialPositions[i * 3 + 1];
      const oz = initialPositions[i * 3 + 2];
      const wave1 = Math.sin(t * 1.7 + ox * 2.6 + oy * 2.0) * 0.03;
      const wave2 = Math.cos(t * 2.2 + oz * 3.0) * 0.018;
      arr[i * 3 + 0] = ox + wave2 * 0.5;
      arr[i * 3 + 1] = oy + wave1;
      arr[i * 3 + 2] = oz + wave2 + Math.sin(t * 0.9 + oy * 1.4) * 0.02;
    }
    pos.needsUpdate = true;

    const map = (mesh.material as THREE.MeshStandardMaterial).map;
    if (map) map.offset.x = (state.clock.elapsedTime * 0.05 * speed) % 1;

    mesh.rotation.y = Math.sin(t * 0.22) * 0.05 + parallax.current.x * 0.05;
    mesh.rotation.x = Math.sin(t * 0.17) * 0.02 - parallax.current.y * 0.03;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        map={texture ?? undefined}
        color="#2a55a0"
        emissive="#60a5fa"
        emissiveIntensity={0.85}
        roughness={0.3}
        metalness={0.35}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Main strand: loops around the figure like the baked mesh fabric
const MAIN_ANCHORS: [number, number, number][] = [
  [0.55, 0.72, -0.55],
  [0.62, 0.42, 0.3],
  [0.28, 0.12, 0.75],
  [-0.35, -0.05, 0.6],
  [-0.62, -0.25, -0.05],
  [-0.35, -0.5, -0.45],
  [0.15, -0.65, 0.25],
  [-0.4, -0.8, 0.8],
  [-0.95, -0.85, 1.0],
];

// Secondary strand: drifts in front, lower-left trail (thinner)
const OFFCUT_ANCHORS: [number, number, number][] = [
  [0.45, -0.28, 1.1],
  [0.05, -0.45, 1.25],
  [-0.5, -0.56, 1.1],
  [-0.95, -0.62, 0.85],
  [-1.25, -0.72, 0.6],
];

const STILL: Parallax = { current: { x: 0, y: 0 } };

function RibbonLayer({ parallax, reduced }: { parallax: Parallax; reduced: boolean }) {
  const { size, camera } = useThree();

  const fov = (camera as THREE.PerspectiveCamera).fov ?? 40;
  const distance = camera.position.z ?? 10;
  const worldHalfH = distance * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const worldHalfW = worldHalfH * (size.width > 0 ? size.width / size.height : 1);
  const input = reduced ? STILL : parallax;

  return (
    <>
      <Ribbon
        worldHalfH={worldHalfH}
        worldHalfW={worldHalfW}
        anchors={MAIN_ANCHORS}
        opacity={0.9}
        speed={reduced ? 0 : 1}
        phase={0}
        parallax={input}
      />
      <Ribbon
        worldHalfH={worldHalfH}
        worldHalfW={worldHalfW}
        anchors={OFFCUT_ANCHORS}
        widthScale={0.55}
        opacity={0.55}
        speed={reduced ? 0 : 1.35}
        phase={2.1}
        parallax={input}
      />
      <Sparkles
        count={reduced ? 22 : 55}
        size={1.8}
        speed={reduced ? 0 : 0.28}
        color="#8cc4ff"
        opacity={0.5}
        scale={[worldHalfW * 1.7, worldHalfH * 1.7, 1.2]}
        position={[0, 0.1, 0.4]}
      />
    </>
  );
}

export default function HeroRibbon3D({
  parallaxRef,
  reducedMotion,
}: {
  /** Shared normalized mouse position (-1..1), mutated in place by the caller */
  parallaxRef?: Parallax;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      frameloop={reducedMotion ? 'demand' : 'always'}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 10], fov: 40 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 6]} intensity={1.1} color="#a8caff" />
      <RibbonLayer parallax={parallaxRef ?? STILL} reduced={reducedMotion} />
    </Canvas>
  );
}
