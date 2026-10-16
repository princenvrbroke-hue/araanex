'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelOrPlaceholderProps {
  modelPath?: string;
  fallback: React.ReactNode;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * GLTF Loader Component with graceful procedural fallback.
 * If a custom compressed GLB model is present in /public/models/..., it renders the real asset.
 * Otherwise, it renders the handcrafted procedural biomechanical geometry.
 */
function RealModel({
  path,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  path: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(path);
  return <primitive object={scene.clone()} scale={scale} position={position} rotation={rotation} />;
}

export function ModelOrPlaceholder({
  modelPath,
  fallback,
  scale,
  position,
  rotation,
}: ModelOrPlaceholderProps) {
  const [modelAvailable, setModelAvailable] = useState(false);

  useEffect(() => {
    if (!modelPath) {
      setModelAvailable(false);
      return;
    }

    // Verify if model exists via HEAD request
    fetch(modelPath, { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('model')) {
          setModelAvailable(true);
        } else {
          setModelAvailable(false);
        }
      })
      .catch(() => {
        setModelAvailable(false);
      });
  }, [modelPath]);

  if (!modelPath || !modelAvailable) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={<>{fallback}</>}>
      <RealModel path={modelPath} scale={scale} position={position} rotation={rotation} />
    </Suspense>
  );
}
