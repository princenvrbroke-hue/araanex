'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { ConstellationNode } from '@/content/aranexData';

interface ResearchModalProps {
  node: ConstellationNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResearchModal({ node, isOpen, onClose }: ResearchModalProps) {
  if (!node || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="relative w-full max-w-xl bg-[#0D1117] border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-[#00E5C7]/10 text-[#00E5C7] border border-[#00E5C7]/30 uppercase">
                  {node.status}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#F0EFEA]">{node.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm font-sans text-white/80 leading-relaxed">{node.summary}</p>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5C7] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>CORE TECHNICAL INITIATIVES</span>
            </h4>
            <div className="space-y-2">
              {node.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5C7] mt-0.5 shrink-0" />
                  <span className="text-xs text-white/80 font-sans">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5C7]/15 hover:bg-[#00E5C7]/25 text-[#00E5C7] text-xs font-mono tracking-wider border border-[#00E5C7]/40 transition-all"
            >
              <span>RETURN TO CONSTELLATION</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
