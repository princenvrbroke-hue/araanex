import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = '',
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[6px] border border-[rgba(160,190,255,0.18)] bg-[#0f192d]/65 backdrop-blur-[14px] p-[14px_18px] transition-all duration-300 ${
        glow ? 'shadow-[0_0_35px_rgba(70,150,255,0.35)] border-[#5aa9ff]/50' : 'hover:border-[rgba(160,190,255,0.35)]'
      } ${className}`}
    >
      {children}
    </div>
  );
}
