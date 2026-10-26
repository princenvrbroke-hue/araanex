import React, { ReactNode } from 'react';

interface IconBadgeProps {
  children: ReactNode;
  active?: boolean;
  size?: number; // default 40
  className?: string;
}

export function IconBadge({
  children,
  active = false,
  size = 40,
  className = '',
}: IconBadgeProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border ${
        active
          ? 'border-[#8cc4ff] bg-[#102040]/80 shadow-[0_0_16px_rgba(140,196,255,0.45)] text-white'
          : 'border-[#8cc4ff]/50 bg-[#0a1428]/60 text-[#c9d3e6] hover:border-[#8cc4ff] hover:text-white'
      } ${className}`}
    >
      {children}
    </div>
  );
}
