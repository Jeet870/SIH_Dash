'use client';

import React from 'react';
import { Activity, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnalyticsData, TelemetryRecord } from '@/types/telemetry';
import { Tooltip } from './Tooltip';

interface DynamometerCardProps {
  analytics?: AnalyticsData | null;
  latest?: TelemetryRecord | null;
}

export const DynamometerCard: React.FC<DynamometerCardProps> = ({ analytics, latest }) => {
  const dyno = analytics?.dynamometer_analysis;
  const fillage = analytics?.pump_fillage;
  const points = dyno?.surface_card || [];

  const maxStroke = latest?.stroke_length_m || 2.5;
  const peakLoad = dyno?.max_card_load_kn ?? (latest ? Math.max(latest.rod_load_kn, 50) : null);
  const minLoad = dyno?.min_card_load_kn ?? (latest ? Math.min(latest.rod_load_kn, 30) : null);
  const strokeWorkKj = dyno?.stroke_work_kj ?? null;
  const fillagePct = fillage?.fillage_pct ?? null;

  const padX = 45;
  const padY = 25;
  const plotW = 400 - padX * 2;
  const plotH = 220 - padY * 2;

  const scaleX = (pos: number) => padX + (pos / Math.max(0.1, maxStroke)) * plotW;
  const scaleY = (load: number) => {
    const yMin = Math.max(0, (minLoad ?? 20) - 15);
    const yMax = (peakLoad ?? 100) + 15;
    return padY + plotH - ((load - yMin) / Math.max(1, yMax - yMin)) * plotH;
  };

  let pathD = '';
  if (points.length > 1) {
    pathD = points.reduce((acc, pt, idx) => {
      const x = scaleX(pt.position_m);
      const y = scaleY(pt.load_kn);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }

  const currentX = latest ? scaleX(latest.rod_position_m) : padX;
  const currentY = latest ? scaleY(latest.rod_load_kn) : padY + plotH / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/70" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 tracking-wider">
            ANALYTICS &bull; CURRENT STATE
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            Surface Dynamometer Card
          </h3>
          <Tooltip
            title="Dynamometer Card (F vs. X)"
            category="ANALYTICS"
            content="Closed-loop plot measuring Polished Rod Load against Vertical Position over a pumping cycle. The enclosed area represents mechanical work performed per stroke."
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1">
            Work: <strong className="text-amber-300">{strokeWorkKj !== null ? `${strokeWorkKj} kJ` : '--'}</strong>
            <Tooltip
              title="Stroke Work"
              category="ANALYTICS"
              content="Mechanical energy imparted to the rod string per stroke cycle (integral of F dx)."
            />
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
            Fillage: <strong className="text-emerald-400">{fillagePct !== null ? `${fillagePct}%` : '--'}</strong>
            <Tooltip
              title="Pump Barrel Fillage %"
              category="ANALYTICS"
              content="Percentage of the downhole pump barrel filled with liquid. Below 60% indicates severe fluid pound risk due to low submergence or extreme viscosity."
            />
          </span>
        </div>
      </div>

      {/* SVG Dynamometer Plot with Dark Industrial Canvas */}
      <div className="relative w-full h-56 bg-slate-950/70 rounded-xl border border-slate-800/90 p-2 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]" />

        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="dynoFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1={padX} y1={padY} x2={padX + plotW} y2={padY} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1={padX} y1={padY + plotH / 2} x2={padX + plotW} y2={padY + plotH / 2} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1={padX} y1={padY + plotH} x2={padX + plotW} y2={padY + plotH} stroke="#475569" strokeOpacity="0.8" />
          <line x1={padX} y1={padY} x2={padX} y2={padY + plotH} stroke="#475569" strokeOpacity="0.8" />
          <line x1={padX + plotW / 2} y1={padY} x2={padX + plotW / 2} y2={padY + plotH} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1={padX + plotW} y1={padY} x2={padX + plotW} y2={padY + plotH} stroke="#475569" strokeOpacity="0.8" />

          {/* Axis Labels */}
          <text x={padX - 8} y={padY + 4} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">
            {peakLoad !== null ? `${Math.round(peakLoad + 15)}kN` : '--'}
          </text>
          <text x={padX - 8} y={padY + plotH} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">
            {minLoad !== null ? `${Math.max(0, Math.round(minLoad - 15))}kN` : '--'}
          </text>
          <text x={padX} y={padY + plotH + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">0m</text>
          <text x={padX + plotW / 2} y={padY + plotH + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {(maxStroke / 2).toFixed(1)}m
          </text>
          <text x={padX + plotW} y={padY + plotH + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            {maxStroke.toFixed(1)}m
          </text>

          {/* Closed Loop Dyno Path */}
          {pathD ? (
            <motion.path
              d={pathD}
              fill="url(#dynoFill)"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinejoin="round"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <text x={padX + plotW / 2} y={padY + plotH / 2} fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="middle">
              Awaiting complete stroke cycle...
            </text>
          )}

          {/* Live Position Radar Pulse Dot */}
          {latest && (
            <g>
              <circle cx={currentX} cy={currentY} r="8" fill="#38bdf8" opacity="0.3" className="animate-ping" />
              <circle cx={currentX} cy={currentY} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono flex items-center gap-3 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block shadow-sm shadow-amber-400/50" /> Trajectory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-sm shadow-sky-400/50 animate-pulse" /> Position
          </span>
        </div>
      </div>

      {/* Dyno metrics footer tiles */}
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="glass-panel-sub p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[9px] font-mono flex items-center gap-1 uppercase tracking-wider">
            PEAK LOAD (PPRL)
            <Tooltip title="Peak Polished Rod Load" category="ANALYTICS" content="Maximum tension experienced at the polished rod during the upstroke cycle." />
          </span>
          <span className="font-mono font-bold text-sm text-slate-100">
            {peakLoad !== null ? `${peakLoad.toFixed(1)} kN` : '--'}
          </span>
        </div>
        <div className="glass-panel-sub p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[9px] font-mono flex items-center gap-1 uppercase tracking-wider">
            MIN LOAD (MPRL)
            <Tooltip title="Minimum Polished Rod Load" category="ANALYTICS" content="Minimum load during downstroke turnaround. Drops < 15 kN indicate rod-floating risk." />
          </span>
          <span className="font-mono font-bold text-sm text-slate-100">
            {minLoad !== null ? `${minLoad.toFixed(1)} kN` : '--'}
          </span>
        </div>
        <div className="glass-panel-sub p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[9px] font-mono flex items-center gap-1 uppercase tracking-wider">
            LOAD RANGE
            <Tooltip title="Load Range" category="ANALYTICS" content="Cyclic stress amplitude (PPRL - MPRL). Drives mechanical rod fatigue." />
          </span>
          <span className="font-mono font-bold text-sm text-amber-400">
            {peakLoad !== null && minLoad !== null ? `${(peakLoad - minLoad).toFixed(1)} kN` : '--'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
