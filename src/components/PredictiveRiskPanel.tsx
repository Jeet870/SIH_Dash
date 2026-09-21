'use client';

import React from 'react';
import { AlertOctagon, ShieldAlert, ArrowDownCircle, Anchor, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PredictionsData } from '@/types/telemetry';
import { Tooltip } from './Tooltip';

interface PredictiveRiskPanelProps {
  predictions?: PredictionsData | null;
}

export const PredictiveRiskPanel: React.FC<PredictiveRiskPanelProps> = ({ predictions }) => {
  const floating = predictions?.rod_floating;
  const impact = predictions?.impact_loading;
  const rodFailure = predictions?.rod_failure;
  const unsetting = predictions?.pump_unsetting;

  const getRiskTheme = (prob?: number) => {
    if (prob === undefined || prob === null) {
      return {
        badge: 'text-slate-400 bg-slate-800/80 border-slate-700',
        bar: 'bg-slate-700',
        text: 'text-slate-400',
      };
    }
    if (prob >= 0.65) {
      return {
        badge: 'text-rose-300 bg-rose-500/20 border-rose-500/40 animate-pulse',
        bar: 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-sm shadow-rose-500/50',
        text: 'text-rose-400',
      };
    }
    if (prob >= 0.35) {
      return {
        badge: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
        bar: 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-sm shadow-amber-500/50',
        text: 'text-amber-400',
      };
    }
    return {
      badge: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40',
      bar: 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/50',
      text: 'text-emerald-400',
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-500/70" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300 tracking-wider">
            PREDICTION &bull; TACTICAL &amp; SHIFT RISK
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            Predictive Mechanical Failure Guard
          </h3>
          <Tooltip
            title="Mechanical Failure Risk Guard"
            category="PREDICTION"
            content="AI models calibrated for tactical operational horizons: 5–30 min for downstroke drag/floating, 1–15 min for impact pound, 1–24 h for seating unsetting, and 24h–30d for cumulative rod fatigue."
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-wider">MULTI-HORIZON RISK INFERENCE</span>
      </div>

      {/* 4 Risk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Rod Floating (5-30 min) */}
        {(() => {
          const theme = getRiskTheme(floating?.floating_probability);
          return (
            <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                    <ArrowDownCircle className="w-4 h-4 text-amber-400" /> Rod Floating
                    <Tooltip
                      title="Rod Floating Risk (Next 5–30 min)"
                      category="PREDICTION"
                      content="Forecasts downstroke viscous drag exceeding buoyant rod weight within the next 5–30 minutes. Updated every 10–30 sec to allow immediate VFD deceleration."
                    />
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${theme.badge}`}>
                    {floating?.floating_probability !== undefined ? `${(floating.floating_probability * 100).toFixed(0)}% Risk` : '--'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">5–30 min</span>
                  <span>&bull; Upd: 10–30s</span>
                </div>
              </div>

              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden my-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(floating?.floating_probability ?? 0) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${theme.bar}`}
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-1">
                <p className="text-[11px] text-purple-300 font-mono font-medium truncate">
                  {floating?.summary ?? 'Awaiting inference run...'}
                </p>
                <span className="text-[10px] text-slate-400 block truncate">
                  Remedy: <span className="text-slate-300">{floating?.recommended_remedy ?? '--'}</span>
                </span>
              </div>
            </div>
          );
        })()}

        {/* 2. Impact Loading (1-15 min) */}
        {(() => {
          const theme = getRiskTheme(impact?.impact_probability);
          return (
            <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400" /> Impact Loading
                    <Tooltip
                      title="Impact Shock Severity (Next 1–15 min)"
                      category="PREDICTION"
                      content="Evaluates turnaround fluid pound and horsehead impact shocks over the next 1–15 min. Updated every 5–10 sec."
                    />
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${theme.badge}`}>
                    {impact?.impact_probability !== undefined ? `${(impact.impact_probability * 100).toFixed(0)}% Shock` : '--'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300">1–15 min</span>
                  <span>&bull; Upd: 5–10s</span>
                </div>
              </div>

              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden my-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(impact?.impact_probability ?? 0) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${theme.bar}`}
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-1">
                <p className="text-[11px] text-rose-300 font-mono font-medium truncate">
                  {impact?.summary ?? (impact?.impact_severity ? impact.impact_severity.replace(/_/g, ' ') : 'Awaiting inference run...')}
                </p>
                <span className="text-[10px] text-slate-400 block truncate">
                  Status: <span className="text-slate-300">{impact?.impact_severity ? impact.impact_severity.replace(/_/g, ' ') : '--'}</span>
                </span>
              </div>
            </div>
          );
        })()}

        {/* 3. Rod Fatigue Failure (24h - 30 days) */}
        {(() => {
          const theme = getRiskTheme(rodFailure?.failure_probability);
          return (
            <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-400" /> Rod String Fatigue
                    <Tooltip
                      title="Rod Failure Risk (Next 24 h – 30 days)"
                      category="PREDICTION"
                      content="Goodman cyclic stress endurance evaluation. Updated every 1–6 hours for preventative replacement scheduling."
                    />
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${theme.badge}`}>
                    {rodFailure?.failure_probability !== undefined ? `${(rodFailure.failure_probability * 100).toFixed(0)}% Fatigue` : '--'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300">24h–30d</span>
                  <span>&bull; Upd: 1–6h</span>
                </div>
              </div>

              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden my-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(rodFailure?.failure_probability ?? 0) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${theme.bar}`}
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-1">
                <p className="text-[11px] text-sky-300 font-mono font-medium truncate">
                  {rodFailure?.summary ?? (rodFailure?.fatigue_risk_level ? `Level: ${rodFailure.fatigue_risk_level}` : 'Awaiting inference run...')}
                </p>
                <span className="text-[10px] text-slate-400 block truncate">
                  Cycles left: <span className="text-slate-300">{rodFailure?.estimated_cycles_to_failure ? `~${(rodFailure.estimated_cycles_to_failure / 1000).toFixed(0)}k` : '--'}</span>
                </span>
              </div>
            </div>
          );
        })()}

        {/* 4. Pump Unsetting Risk (1-24h) */}
        {(() => {
          const theme = getRiskTheme(unsetting?.unsetting_probability);
          return (
            <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                    <Anchor className="w-4 h-4 text-purple-400" /> Pump Unsetting
                    <Tooltip
                      title="Pump Unsetting Probability (Next 1–24 h)"
                      category="PREDICTION"
                      content="Mechanical hold-down unseating probability caused by upward drag and pressure differentials. Updated every 5–15 min."
                    />
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${theme.badge}`}>
                    {unsetting?.unsetting_probability !== undefined ? `${(unsetting.unsetting_probability * 100).toFixed(0)}% Hold` : '--'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">1–24 h</span>
                  <span>&bull; Upd: 5–15m</span>
                </div>
              </div>

              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden my-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(unsetting?.unsetting_probability ?? 0) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${theme.bar}`}
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-1">
                <p className="text-[11px] text-indigo-300 font-mono font-medium truncate">
                  {unsetting?.summary ?? (unsetting?.status ? unsetting.status.replace(/_/g, ' ') : 'Awaiting inference run...')}
                </p>
                <span className="text-[10px] text-slate-400 block truncate">
                  Action: <span className="text-slate-300">{unsetting?.recommended_action ?? '--'}</span>
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
};
