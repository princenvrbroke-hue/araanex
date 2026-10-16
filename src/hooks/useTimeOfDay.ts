'use client';

import { useState, useEffect } from 'react';

export type TimeMode = 'auto' | 'dawn' | 'day' | 'dusk' | 'night';

export interface LightingPreset {
  name: string;
  hourLabel: string;
  ambientColor: string;
  ambientIntensity: number;
  dirLightColor: string;
  dirLightIntensity: number;
  dirLightPosition: [number, number, number];
  rimColor: string;
  rimIntensity: number;
  fogColor: string;
  description: string;
}

export const LIGHTING_PRESETS: Record<'dawn' | 'day' | 'dusk' | 'night', LightingPreset> = {
  dawn: {
    name: "Dawn Laboratory",
    hourLabel: "06:00 - 08:30",
    ambientColor: "#2A2328",
    ambientIntensity: 0.8,
    dirLightColor: "#FFD2A6",
    dirLightIntensity: 2.2,
    dirLightPosition: [6, 4, 4],
    rimColor: "#93C5FD",
    rimIntensity: 1.2,
    fogColor: "#0A0B10",
    description: "Low-angle morning illumination with soft gold directional vectors",
  },
  day: {
    name: "Solar Calibration",
    hourLabel: "09:00 - 17:00",
    ambientColor: "#1B232E",
    ambientIntensity: 0.9,
    dirLightColor: "#FFFFFF",
    dirLightIntensity: 2.6,
    dirLightPosition: [4, 8, 5],
    rimColor: "#38BDF8",
    rimIntensity: 1.0,
    fogColor: "#05070A",
    description: "High-kelvin daylight balance for precision material inspection",
  },
  dusk: {
    name: "Twilight Transition",
    hourLabel: "17:30 - 20:30",
    ambientColor: "#231826",
    ambientIntensity: 0.7,
    dirLightColor: "#E5A93C",
    dirLightIntensity: 2.0,
    dirLightPosition: [-6, 3, 3],
    rimColor: "#EC4899",
    rimIntensity: 1.4,
    fogColor: "#0B0710",
    description: "Dramatic warm amber horizon grazing with deep chromatic falloff",
  },
  night: {
    name: "Midnight Biometrics",
    hourLabel: "21:00 - 05:30",
    ambientColor: "#080F16",
    ambientIntensity: 0.5,
    dirLightColor: "#00E5C7",
    dirLightIntensity: 1.8,
    dirLightPosition: [0, 6, 6],
    rimColor: "#3B82F6",
    rimIntensity: 1.8,
    fogColor: "#05070A",
    description: "Low ambient ink-black with electric cyan and cobalt fluorescence",
  },
};

export function getResolvedTimeMode(hour: number): 'dawn' | 'day' | 'dusk' | 'night' {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
}

export function useTimeOfDay() {
  const [mode, setMode] = useState<TimeMode>('auto');
  const [currentHour, setCurrentHour] = useState<number>(14);

  useEffect(() => {
    const now = new Date();
    setCurrentHour(now.getHours() + now.getMinutes() / 60);

    const interval = setInterval(() => {
      const updated = new Date();
      setCurrentHour(updated.getHours() + updated.getMinutes() / 60);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const activeKey: 'dawn' | 'day' | 'dusk' | 'night' = 
    mode === 'auto' ? getResolvedTimeMode(currentHour) : mode;

  const preset = LIGHTING_PRESETS[activeKey];

  return {
    mode,
    setMode,
    activeKey,
    preset,
    currentHour,
  };
}
