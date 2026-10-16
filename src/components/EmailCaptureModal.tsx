'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, CheckCircle } from 'lucide-react';
import { sound } from '@/lib/soundEngine';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailCaptureModal({ isOpen, onClose }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Researcher / Academic');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    sound.playDataPulse();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0D1117] border border-[#00E5C7]/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#00E5C7] uppercase">
                RESEARCH DISPATCHES &amp; CLINICAL INVITATIONS
              </span>
              <h3 className="font-serif text-2xl text-[#F0EFEA] mt-1">
                Join the Research Journey
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Receive quarterly laboratory updates, preprint publications on bio-responsive textiles, and early invitations to beta wear-test trials.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-white/50 uppercase">
                  Primary Perspective / Focus
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/10 text-xs font-sans text-[#F0EFEA] focus:outline-none focus:border-[#00E5C7]"
                >
                  <option>Researcher / Academic Physiology</option>
                  <option>Clinician / Ergonomist</option>
                  <option>Elite Athlete / Trainer</option>
                  <option>Industrial Safety Engineer</option>
                  <option>Curious Explorer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-white/50 uppercase">
                  Institutional / Personal Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu or personal"
                  className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-[#F0EFEA] focus:outline-none focus:border-[#00E5C7]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00E5C7] hover:bg-[#56FFDD] text-[#05070A] text-xs font-mono font-semibold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,229,199,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Research Dispatch Access</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 pt-2 border-t border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00E5C7]" />
                <span>Zero marketing spam. Unsubscribe anytime. Strict data privacy.</span>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#00E5C7]/20 border border-[#00E5C7] flex items-center justify-center mx-auto text-[#00E5C7]">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl text-[#F0EFEA]">
                Dispatch Transmission Confirmed
              </h4>
              <p className="text-xs text-white/70 max-w-sm mx-auto font-sans leading-relaxed">
                Thank you for contributing to the scientific inquiry into wearable biology. We will deliver the next quarterly lab whitepaper directly to your inbox.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-all"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
