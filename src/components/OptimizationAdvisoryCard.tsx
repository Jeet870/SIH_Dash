'use client';

import React from 'react';
import { Sliders, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { OptimizationAdvisoryItem } from '@/types/telemetry';
import { Tooltip } from './Tooltip';

interface OptimizationAdvisoryCardProps {
  items?: OptimizationAdvisoryItem[];
}

export const OptimizationAdvisoryCard: React.FC<OptimizationAdvisoryCardProps> = ({ items }) => {
  const advisoryList = items || [];
  const hasItems = advisoryList.length > 0;

  const surfaceItems = advisoryList.slice(0, 4);
  const thermalItems = advisoryList.slice(4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-panel rounded-xl p-5 relative overflow-hidden space-y-4"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-600/70" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 tracking-wider">
            CONTROL &bull; DECISION CADENCE
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            Field Optimization &amp; Recommended Decision Intervals
          </h3>
          <Tooltip
            title="Optimization Decision Intervals"
            category="CONTROL"
            content="Specifies recommended operator/automation decision cadence: tactical parameters (SPM, VFD) adjust every 5–15 min, operational parameters (Stroke, Cut-off) adjust every 1–6 h, and CSS thermal parameters adjust continuously or per cycle."
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-wider">AUTOMATED ADVISORY ENGINE</span>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          {/* Group 1: Surface Machinery & Pumping Controls */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                ⚙️ Surface Machinery &amp; Lift Controls
              </span>
              <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-850 border border-slate-800">
                SHIFT / TACTICAL
              </span>
            </div>

            <div className="space-y-2.5">
              {surfaceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-100 text-xs">{item.parameter}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        Now: <strong className="text-slate-200">{item.current_setting}</strong>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.decision_interval}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 pt-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span className="font-semibold text-[11px]">{item.recommended_action}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 pl-5 italic">
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: CSS Thermal & Reservoir Cycle Strategy */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                🔥 CSS Thermal &amp; Reservoir Cycle Strategy
              </span>
              <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-850 border border-slate-800">
                CYCLE / STRATEGIC
              </span>
            </div>

            <div className="space-y-2.5">
              {thermalItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-100 text-xs">{item.parameter}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        Now: <strong className="text-slate-200">{item.current_setting}</strong>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-orange-500/10 border border-orange-500/30 text-orange-300 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.decision_interval}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 pt-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span className="font-semibold text-[11px]">{item.recommended_action}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 pl-5 italic">
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel-sub border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono">
          Awaiting multi-objective advisory engine evaluation...
        </div>
      )}
    </motion.div>
  );
};
