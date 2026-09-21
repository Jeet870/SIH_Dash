'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import { TelemetryRecord } from '@/types/telemetry';
import { Gauge, TrendingUp, Radio } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface TelemetryGraphsProps {
  history: TelemetryRecord[];
}

export const TelemetryGraphs: React.FC<TelemetryGraphsProps> = ({ history }) => {
  const chartData = history.map((rec, i) => {
    let timeLabel = `${i}`;
    try {
      const d = new Date(rec.timestamp);
      timeLabel = d.toTimeString().split(' ')[0].slice(3);
    } catch (_) {}

    return {
      time: timeLabel,
      rod_load_kn: Number(rec.rod_load_kn.toFixed(1)),
      motor_current_a: Number(rec.motor_current_a.toFixed(1)),
      production_bopd: Number(rec.production_bopd.toFixed(1)),
      fluid_level_m: Number(rec.fluid_level_m.toFixed(1)),
      tubing_pressure_bar: Number(rec.tubing_pressure_bar.toFixed(1)),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Rod Load & Motor Current */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/60" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 tracking-wider flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-amber-400" /> LIVE STREAM
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-400" />
              Live Mechanical &amp; Electrical Load
            </h3>
            <Tooltip
              title="Live Load & Current Stream"
              category="ANALYTICS"
              content="Real-time telemetry showing mechanical load on the polished rod (kN) alongside surface electric motor draw current (A)."
            />
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Rod Load (kN)
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Current (A)
            </span>
          </div>
        </div>

        <div className="w-full h-60 pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} fontFamily="monospace" />
                <YAxis yAxisId="left" stroke="#f59e0b" fontSize={10} domain={['dataMin - 5', 'dataMax + 10']} fontFamily="monospace" />
                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" fontSize={10} domain={['dataMin - 5', 'dataMax + 10']} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f8fafc',
                    fontFamily: 'monospace',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="rod_load_kn" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#loadGrad)" isAnimationActive animationDuration={700} />
                <Area yAxisId="right" type="monotone" dataKey="motor_current_a" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#currentGrad)" isAnimationActive animationDuration={700} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Awaiting telemetry streaming...
            </div>
          )}
        </div>
      </motion.div>

      {/* Chart 2: Production Rate & Fluid Level */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/70" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 tracking-wider flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" /> LIVE STREAM
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Live Inflow &amp; Production
            </h3>
            <Tooltip
              title="Inflow & Production Stream"
              category="ANALYTICS"
              content="Real-time stream of gross oil production (BOPD) versus downhole fluid level (depth in meters from surface)."
            />
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Production (BOPD)
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /> Fluid Level (m)
            </span>
          </div>
        </div>

        <div className="w-full h-60 pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fluidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} fontFamily="monospace" />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={10} domain={['dataMin - 5', 'dataMax + 5']} fontFamily="monospace" />
                <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={10} domain={['dataMin - 20', 'dataMax + 20']} fontFamily="monospace" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#f8fafc',
                    fontFamily: 'monospace',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="production_bopd" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#prodGrad)" isAnimationActive animationDuration={700} />
                <Area yAxisId="right" type="monotone" dataKey="fluid_level_m" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#fluidGrad)" isAnimationActive animationDuration={700} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Awaiting telemetry streaming...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
