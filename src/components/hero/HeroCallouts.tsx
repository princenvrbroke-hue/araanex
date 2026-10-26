'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PersonStanding, Bone, Atom } from 'lucide-react';

/**
 * Hero annotations around the mannequin (matches the hero mockup):
 * three icon callouts on the left with hairline leaders into the figure,
 * "Engineered layers" top-right, "A smarter future" bottom-right.
 *
 * Leader lines are measured from live DOM rects whenever the column or the
 * plate resizes — no per-frame work. The whole layer is faded out by
 * HeroScrollSequence once the orbit starts (anchors only fit frame 1).
 */

interface HeroCalloutsProps {
  /** The 16:9 plate the scrub canvas fills; anchors are ratios of it */
  plateRef: React.RefObject<HTMLDivElement | null>;
}

const LEFT_CALLOUTS = [
  { id: 'anatomy', icon: PersonStanding, title: 'Anatomy', sub: 'Fit to your body', top: '14%', anchor: { x: 0.43, y: 0.2 } },
  { id: 'biomech', icon: Bone, title: 'Biomechanics', sub: 'Move with freedom', top: '29%', anchor: { x: 0.37, y: 0.42 } },
  { id: 'material', icon: Atom, title: 'Material science', sub: 'Built for performance', top: '44%', anchor: { x: 0.44, y: 0.62 } },
];

/** Where the "Engineered layers" leader lands: the right-arm mesh */
const LAYERS_ANCHOR = { x: 0.63, y: 0.3 };

interface Segment {
  id: string;
  points: string;
  end: { x: number; y: number };
}

export function HeroCallouts({ plateRef }: HeroCalloutsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const layersRef = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const plate = plateRef.current;
    if (!root || !plate) return;

    const measure = () => {
      const r = root.getBoundingClientRect();
      const p = plate.getBoundingClientRect();
      if (!r.width || !p.width) return;
      const at = (a: { x: number; y: number }) => ({
        x: p.left - r.left + p.width * a.x,
        y: p.top - r.top + p.height * a.y,
      });

      const next: Segment[] = [];
      for (const c of LEFT_CALLOUTS) {
        const el = calloutRefs.current[c.id];
        if (!el) continue;
        const b = el.getBoundingClientRect();
        const start = { x: b.right - r.left + 8, y: b.top - r.top + b.height / 2 };
        const end = at(c.anchor);
        // Short horizontal run, then an angled drop to the anchor
        const elbow = { x: start.x + 18, y: start.y };
        next.push({ id: c.id, points: `${start.x},${start.y} ${elbow.x},${elbow.y} ${end.x},${end.y}`, end });
      }
      const layers = layersRef.current;
      if (layers) {
        const b = layers.getBoundingClientRect();
        const start = { x: b.left - r.left - 10, y: b.top - r.top + 8 };
        const end = at(LAYERS_ANCHOR);
        next.push({ id: 'layers', points: `${start.x},${start.y} ${end.x},${end.y}`, end });
      }
      setSegments(next);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(plate);
    return () => ro.disconnect();
  }, [plateRef]);

  return (
    <div ref={rootRef} className="absolute inset-0 z-20 pointer-events-none hidden lg:block">
      <svg className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        {segments.map((s) => (
          <g key={s.id}>
            <polyline points={s.points} fill="none" stroke="rgba(140,196,255,0.45)" strokeWidth={1} />
            <circle cx={s.end.x} cy={s.end.y} r={3} fill="#05080f" stroke="#8cc4ff" strokeWidth={1.2} />
          </g>
        ))}
      </svg>

      {/* Left: three discipline callouts */}
      <ul className="absolute left-0 inset-y-0 w-[190px]">
        {LEFT_CALLOUTS.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.id} className="absolute left-0" style={{ top: c.top }}>
              <div
                ref={(el) => {
                  calloutRefs.current[c.id] = el;
                }}
                className="flex items-center gap-3"
              >
                <span className="w-10 h-10 shrink-0 rounded-full border border-[#8cc4ff]/50 bg-[#0a1428]/70 flex items-center justify-center text-[#c9d3e6]">
                  <Icon size={17} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white">
                    {c.title}
                  </span>
                  <span className="block text-[11px] text-[#c9d3e6] mt-0.5">{c.sub}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Top right: engineered layers */}
      <div className="absolute right-0 top-[4%] w-[210px] hidden xl:block">
        <div ref={layersRef}>
          <span className="block text-[11px] font-medium tracking-[0.18em] uppercase text-white">
            Engineered layers
          </span>
          <span className="block text-[12px] text-[#c9d3e6] mt-1.5">
            Breathable <span className="text-[#5aa9ff] mx-1">•</span> Adaptive{' '}
            <span className="text-[#5aa9ff] mx-1">•</span> Durable
          </span>
        </div>
        <LayerStack />
      </div>

      {/* Bottom right: a smarter future */}
      <div className="absolute right-0 bottom-[6%] w-[310px] hidden xl:flex items-center gap-4">
        <BodyScanHud />
        <div className="border-l border-[rgba(160,190,255,0.25)] pl-4">
          <span className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#8cc4ff]">
            A smarter future
          </span>
          <p className="text-[12px] leading-[1.5] text-[#c9d3e6] mt-1.5">
            Wearables that understand your body. And help you stay ahead.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Four floating mesh sheets with airflow arrows rising through them */
function LayerStack() {
  const sheets = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 220 180" className="w-full mt-2 overflow-visible" aria-hidden="true">
      <defs>
        <pattern id="hc-mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <path d="M0 3 H6 M3 0 V6" stroke="rgba(160,200,255,0.35)" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="hc-sheet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a2f55" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#4d86d8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9fd0ff" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="hc-arrow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#5aa9ff" stopOpacity="0" />
          <stop offset="1" stopColor="#8cc4ff" />
        </linearGradient>
        <filter id="hc-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Thin tilted sheets, each with a glowing leading edge */}
      {sheets.map((i) => {
        const y = 78 + i * 27;
        const back = `M28 ${y} C 72 ${y - 26}, 118 ${y + 10}, 206 ${y - 30}`;
        const d = `${back} L 194 ${y - 12} C 120 ${y + 26}, 70 ${y - 6}, 14 ${y + 16} Z`;
        const front = `M14 ${y + 16} C 70 ${y - 6}, 120 ${y + 26}, 194 ${y - 12}`;
        return (
          <g key={i} opacity={1 - i * 0.14}>
            <path d={d} fill="url(#hc-sheet)" fillOpacity="0.55" />
            <path d={d} fill="url(#hc-mesh)" />
            <path d={back} fill="none" stroke="#8cc4ff" strokeOpacity="0.35" strokeWidth="0.8" />
            <path d={front} fill="none" stroke="#9fd0ff" strokeWidth="1.4" filter="url(#hc-glow)" />
          </g>
        );
      })}

      {/* Airflow arrows rising out of the stack */}
      <g filter="url(#hc-glow)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[
          { x: 140, top: 6, h: 70 },
          { x: 168, top: 18, h: 60 },
          { x: 192, top: 30, h: 48 },
        ].map((a) => (
          <g key={a.x}>
            <path d={`M${a.x} ${a.top + a.h} C ${a.x - 6} ${a.top + a.h * 0.6}, ${a.x} ${a.top + a.h * 0.3}, ${a.x} ${a.top}`} stroke="url(#hc-arrow)" strokeWidth="3" />
            <path d={`M${a.x - 7} ${a.top + 9} L${a.x} ${a.top} L${a.x + 7} ${a.top + 9}`} stroke="#8cc4ff" strokeWidth="2.4" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Circular body-scan HUD: rings, ticks and a wireframe figure */
function BodyScanHud() {
  return (
    <svg viewBox="0 0 120 120" className="w-[104px] h-[104px] shrink-0" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(140,196,255,0.25)" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(140,196,255,0.35)" strokeDasharray="2 4" />
      <circle cx="60" cy="60" r="34" fill="rgba(47,111,224,0.12)" stroke="rgba(140,196,255,0.5)" />
      {/* Arc highlights */}
      <path d="M60 4 A56 56 0 0 1 112 42" fill="none" stroke="#5aa9ff" strokeWidth="1.6" />
      <path d="M8 78 A56 56 0 0 0 40 113" fill="none" stroke="#5aa9ff" strokeWidth="1.6" />
      {/* Ticks */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r1 = i % 6 === 0 ? 48 : 51;
        return (
          <line
            key={i}
            x1={60 + Math.cos(a) * r1}
            y1={60 + Math.sin(a) * r1}
            x2={60 + Math.cos(a) * 54}
            y2={60 + Math.sin(a) * 54}
            stroke="rgba(140,196,255,0.5)"
            strokeWidth="0.8"
          />
        );
      })}
      {/* Figure */}
      <g stroke="#8cc4ff" strokeWidth="1.3" fill="rgba(90,169,255,0.25)" strokeLinecap="round">
        <circle cx="60" cy="38" r="4" />
        <path d="M54 45 h12 l2 18 h-16 z" />
        <path d="M54 46 l-5 14 l1 9 M66 46 l5 14 l-1 9" fill="none" />
        <path d="M56 63 l-2 22 M64 63 l2 22" fill="none" />
      </g>
      <circle cx="58" cy="50" r="1.8" fill="#9fd0ff" />
    </svg>
  );
}
