'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { BiomechanicsProblem } from '@/content/aranexData';

interface EvidenceDrawerProps {
  problem: BiomechanicsProblem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ problem, isOpen, onClose }: EvidenceDrawerProps) {
  if (!problem || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] z-40 bg-[#0D1117]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#00E5C7]" />
            <span className="font-mono text-xs tracking-wider text-[#00E5C7] uppercase">
              PEER-REVIEWED SCIENTIFIC EVIDENCE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                {problem.evidence.year}
              </span>
              <h4 className="font-sans font-semibold text-sm text-[#F0EFEA]">
                {problem.evidence.journal}
              </h4>
            </div>
            <p className="text-xs text-white/70 italic leading-relaxed mt-1">
              &ldquo;{problem.evidence.finding}&rdquo;
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#05070A]/80 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#00E5C7]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ARANEX TRANSLATIONAL PRINCIPLE</span>
            </div>
            <p className="text-xs text-white/80 font-sans leading-relaxed">
              {problem.aranexPrinciple}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/10">
            <span>DOI: {problem.evidence.doi}</span>
            <span className="text-[#00E5C7] flex items-center gap-1 hover:underline cursor-pointer">
              Index Record <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
