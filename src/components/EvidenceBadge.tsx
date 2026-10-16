'use client';

import React from 'react';
import { ARANEX_CONTENT } from '@/content/aranexData';

interface EvidenceBadgeProps {
  level: 'established' | 'designIntent' | 'futureVision';
  className?: string;
}

export function EvidenceBadge({ level, className = '' }: EvidenceBadgeProps) {
  const config = ARANEX_CONTENT.evidenceLabels[level];
  if (!config) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono tracking-wider uppercase transition-all duration-300 ${config.color} ${className}`}
      title={config.description}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{config.text}</span>
    </div>
  );
}
