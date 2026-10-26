'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Eyebrow } from './ui/Eyebrow';
import { ConstellationNode } from '@/content/aranexData';

interface ResearchModalProps {
  nodes: ConstellationNode[];
  isOpen: boolean;
  onClose: () => void;
}

export function ResearchModal({ nodes, isOpen, onClose }: ResearchModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Our Research"
      eyebrow={<Eyebrow text="RESEARCH & INSIGHTS" />}
      className="max-w-2xl p-6 md:p-8"
    >
      <p className="mt-3 text-[15px] font-light text-[#c9d3e6] leading-[1.55]">
        Our programmes run in parallel, each moving from lab work toward pilot production at its own pace.
      </p>

      <div className="mt-6 space-y-4">
        {nodes.map((node) => (
          <article
            key={node.id}
            className="p-4 md:p-5 rounded-xl border border-[rgba(160,190,255,0.18)] bg-[#0d1422]/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[17px] font-medium text-white">{node.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.14em] uppercase bg-[#5aa9ff]/10 text-[#8cc4ff] border border-[#5aa9ff]/30">
                {node.status}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-[#c9d3e6] leading-relaxed">{node.summary}</p>
            <ul className="mt-3 space-y-1.5">
              {node.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-[12px] text-[#c9d3e6]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5aa9ff] mt-0.5 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Dialog>
  );
}
