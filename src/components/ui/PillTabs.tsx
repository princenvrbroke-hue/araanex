'use client';

import React, { ReactNode } from 'react';

export interface PillTabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  subtitle?: string;
}

interface PillTabsProps {
  items: PillTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  vertical?: boolean;
  className?: string;
}

export function PillTabs({
  items,
  activeId,
  onChange,
  vertical = false,
  className = '',
}: PillTabsProps) {
  return (
    <div
      role="group"
      className={`flex ${
        vertical ? 'flex-col gap-2.5' : 'flex-row items-center gap-2 p-1 rounded-full bg-[#0d1422]/70 border border-[rgba(160,190,255,0.18)]'
      } ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;

        if (vertical) {
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(tab.id)}
              className={`w-[130px] h-[42px] px-3.5 rounded-full flex items-center gap-2.5 text-[13px] font-medium transition-all duration-300 border text-left cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#8cc4ff] to-[#5aa9ff] text-[#061021] border-transparent shadow-[0_0_20px_rgba(90,169,255,0.4)] font-semibold'
                  : 'bg-[#0d1422]/60 text-[#c9d3e6] border-[rgba(160,190,255,0.18)] hover:border-[#8cc4ff]/50 hover:text-white'
              }`}
            >
              {tab.icon && (
                <span className={`shrink-0 ${isActive ? 'text-[#061021]' : 'text-[#8cc4ff]'}`}>
                  {tab.icon}
                </span>
              )}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[#8cc4ff] to-[#5aa9ff] text-[#061021] font-semibold shadow-[0_0_18px_rgba(90,169,255,0.35)]'
                : 'text-[#c9d3e6] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
