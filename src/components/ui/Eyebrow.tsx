import React from 'react';

interface EyebrowProps {
  prefix?: string;
  text: string;
  className?: string;
}

export function Eyebrow({ prefix, text, className = '' }: EyebrowProps) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-medium tracking-[0.18em] uppercase ${className}`}>
      {prefix && <span className="text-white">{prefix}</span>}
      <span className="text-[#8cc4ff]">{text}</span>
    </div>
  );
}
