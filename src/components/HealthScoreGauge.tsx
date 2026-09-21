'use client';

import React from 'react';
import { ShieldCheck, Flame, Wrench, BarChart3, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WellHealthScore } from '@/types/telemetry';
import { Tooltip } from './Tooltip';

interface HealthScoreGaugeProps {
  healthScore?: WellHealthScore | null;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ healthScore }) => {
  const isAvailable = Boolean(healthScore && typeof healthScore.well_health_score === 'number');
  const score = isAvailable ? healthScore!.well_health_score : null;
  const status = healthScore?.health_status ?? 'INITIALIZING...';
  const sub = healthScore?.sub_scores;

  const getTheme = (val: number | null) => {
    if (val === null) {
      return {
        text: 'text-slate-400',
        stroke: '#475569',
        badge: 'bg-slate-800/60 text-slate-400 border-slate-700',
        glow: 'from-slate-500/20 to-transparent',
      };
    }
    if (val >= 80) {
      return {
        text: 'text-emerald-400',
        stroke: '#10b981',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        glow: 'from-emerald-500/20 to-transparent',
      };
    }
    if (val >= 60) {
      return {
        text: 'text-sky-400',
        stroke: '#38bdf8',
        badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
        glow: 'from-sky-500/20 to-transparent',
      };
    }
    if (val >= 45) {
      return {
        text: 'text-amber-400',
        stroke: '#f59e0b',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        glow: 'from-amber-500/20 to-transparent',
      };
    }
    return {
      text: 'text-rose-400',
      stroke: '#f43f5e',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      glow: 'from-rose-500/20 to-transparent',
    };
  };

  const currentTheme = getTheme(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = score !== null ? circumference - (score / 100) * circumference : circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-sky-500/70" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-sky-500/10 border border-sky-500/30 text-sky-300 tracking-wider">
            ANALYTICS &bull; CURRENT STATE
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Well Health Score
          </h3>
          <Tooltip
            title="Well Health Score (0–100)"
            category="ANALYTICS"
            content="Real-time composite index representing overall well integrity. Synthesizes 5 domains: Thermal decay, Mechanical stress, Volumetric fillage, Motor power, and Sensor data quality."
          />
        </div>
        <span className={`text-[11px] px-3 py-0.5 rounded-full border font-mono font-semibold tracking-wide ${currentTheme.badge}`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Main Gauge & Sub-Scores Layout */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* Futuristic SVG HUD Gauge */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          {/* Ambient Glow Halo */}
          <div className={`absolute inset-2 rounded-full bg-gradient-to-b ${currentTheme.glow} blur-xl opacity-70`} />

          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-800/80"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Decorative dashed outer boundary */}
            <circle
              cx="80"
              cy="80"
              r={radius + 9}
              className="stroke-slate-800"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="transparent"
            />
            {/* Animated Active Progress Arc */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke={currentTheme.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: `drop-shadow(0 0 6px ${currentTheme.stroke}88)`,
              }}
            />
          </svg>

          {/* Central Readout */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black text-white font-mono tracking-tighter"
            >
              {score !== null ? score : '--'}
            </motion.span>
            <span className="text-[9px] font-mono text-slate-400 tracking-widest font-semibold uppercase mt-0.5">
              {score !== null ? 'INDEX / 100' : 'CALCULATING...'}
            </span>
          </div>
        </div>

        {/* 5 Sub-Scores Breakdown */}
        <div className="flex-1 w-full space-y-2.5 text-xs">
          {/* 1. Thermal State */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Thermal State (25%)
                <Tooltip
                  title="Thermal State Sub-Score"
                  category="ANALYTICS"
                  content="Evaluates current downhole temperature vs. optimal production window (>60°C). Lower temperatures cause high viscosity drag."
                />
              </span>
              <span className="font-mono font-bold text-rose-300">
                {sub?.thermal_score !== undefined ? `${sub.thermal_score}%` : '--'}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sub?.thermal_score ?? 0}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-rose-500 to-rose-400 h-1.5 rounded-full shadow-sm shadow-rose-500/50"
              />
            </div>
          </div>

          {/* 2. Mechanical Lift */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Wrench className="w-3.5 h-3.5 text-amber-400" /> Mechanical Lift (25%)
                <Tooltip
                  title="Mechanical Lift Sub-Score"
                  category="ANALYTICS"
                  content="Measures polished rod load stability. Penalizes rod-floating risk (min load < 20 kN) and excessive peak load (> 140 kN)."
                />
              </span>
              <span className="font-mono font-bold text-amber-300">
                {sub?.mechanical_score !== undefined ? `${sub.mechanical_score}%` : '--'}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sub?.mechanical_score ?? 0}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full shadow-sm shadow-amber-500/50"
              />
            </div>
          </div>

          {/* 3. Production Efficiency */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Production Efficiency (20%)
                <Tooltip
                  title="Volumetric Efficiency Sub-Score"
                  category="ANALYTICS"
                  content="Ratio of actual daily gross oil production to theoretical plunger displacement based on stroke and SPM."
                />
              </span>
              <span className="font-mono font-bold text-emerald-300">
                {sub?.production_efficiency_score !== undefined ? `${sub.production_efficiency_score}%` : '--'}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sub?.production_efficiency_score ?? 0}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full shadow-sm shadow-emerald-500/50"
              />
            </div>
          </div>

          {/* 4. Electrical / Motor */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-sky-400" /> Electrical / Motor (15%)
                <Tooltip
                  title="Electrical Motor Load Sub-Score"
                  category="ANALYTICS"
                  content="Monitors surface electric motor current draw vs. full-load rating. Penalizes motor overcurrent and extreme underload."
                />
              </span>
              <span className="font-mono font-bold text-sky-300">
                {sub?.electrical_score !== undefined ? `${sub.electrical_score}%` : '--'}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sub?.electrical_score ?? 0}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-sky-500 to-cyan-400 h-1.5 rounded-full shadow-sm shadow-sky-500/50"
              />
            </div>
          </div>

          {/* 5. Sensor Health */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Sensor Health (15%)
                <Tooltip
                  title="Sensor Data Quality Sub-Score"
                  category="ANALYTICS"
                  content="Continuously assesses signal integrity across all 18 sensors. Flags frozen channels, missing packets, and unphysical outliers."
                />
              </span>
              <span className="font-mono font-bold text-purple-300">
                {sub?.sensor_health_score !== undefined ? `${sub.sensor_health_score}%` : '--'}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sub?.sensor_health_score ?? 0}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-1.5 rounded-full shadow-sm shadow-purple-500/50"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
