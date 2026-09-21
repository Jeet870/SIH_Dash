'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Flame,
  Gauge,
  Activity,
  Play,
  Square,
  RotateCcw,
  Layers,
  ArrowUp,
  ArrowDown,
  Zap,
  Sparkles,
  Hourglass,
  Snowflake,
  Settings,
  Droplets,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelemetryRecord } from '@/types/telemetry';

interface SimulatorControlsProps {
  simulatorApiUrl?: string;
  latest?: TelemetryRecord | null;
  onParameterChanged?: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  simulatorApiUrl,
  latest,
  onParameterChanged,
}) => {
  const url = simulatorApiUrl || process.env.NEXT_PUBLIC_SIMULATOR_API_URL || 'http://localhost:3001';
  const [loadingParam, setLoadingParam] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const setParam = async (parameter: string, value: number) => {
    setLoadingParam(parameter);
    setLastMessage(null);
    try {
      const res = await fetch(`${url}/api/v1/simulator/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameter, value: Number(value) }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastMessage(`✓ Set ${parameter} = ${value}`);
        if (onParameterChanged) onParameterChanged();
      } else {
        setLastMessage(`Error: ${data.message || 'Failed'}`);
      }
    } catch (err: any) {
      setLastMessage(`Connection error: ${err.message}`);
    } finally {
      setLoadingParam(null);
    }
  };

  const controlLoop = async (action: 'start' | 'stop') => {
    setLoadingParam(`loop_${action}`);
    try {
      const res = await fetch(`${url}/api/v1/simulator/${action}`, {
        method: 'POST',
      });
      const data = await res.json();
      setLastMessage(`Simulator ${action === 'start' ? 'Resumed' : 'Paused'}`);
      if (onParameterChanged) onParameterChanged();
    } catch (err: any) {
      setLastMessage(`Error: ${err.message}`);
    } finally {
      setLoadingParam(null);
    }
  };

  const applyScenario = async (scenarioName: string, params: Record<string, number>) => {
    setLoadingParam('scenario');
    setLastMessage(`Applying ${scenarioName}...`);
    for (const [key, val] of Object.entries(params)) {
      await fetch(`${url}/api/v1/simulator/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameter: key, value: val }),
      });
    }
    setLastMessage(`Applied: ${scenarioName}`);
    if (onParameterChanged) onParameterChanged();
    setLoadingParam(null);
  };

  const applyCssStage = async (stage: 'STEAM' | 'SOAK' | 'PRODUCTION') => {
    setLoadingParam(`css_${stage}`);
    const stageNames: Record<string, string> = {
      STEAM: 'Steam Injection (Huff)',
      SOAK: 'Steam Soaking (Soak)',
      PRODUCTION: 'Hot Flush Production (Puff)',
    };
    setLastMessage(`Initiating ${stageNames[stage]}...`);
    try {
      const res = await fetch(`${url}/api/v1/simulator/stage/${stage}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastMessage(`✓ CSS Stage Active: ${stageNames[stage]}`);
        if (onParameterChanged) onParameterChanged();
      } else {
        setLastMessage(`Error: ${data.message || 'Failed'}`);
      }
    } catch (err: any) {
      setLastMessage(`Connection error: ${err.message}`);
    } finally {
      setLoadingParam(null);
    }
  };

  const temp = latest?.temperature_c ?? 50.0;
  const spm = latest?.spm ?? 5.5;
  const vfd = latest?.vfd_frequency_hz ?? 40.0;
  const stroke = latest?.stroke_length_m ?? 2.5;
  const press = latest?.tubing_pressure_bar ?? 18.5;
  const fluidLevel = latest?.fluid_level_m ?? 850.0;

  const isPumpStopped = spm <= 0.05;
  const activeStage =
    latest?.operating_stage ||
    (isPumpStopped ? (temp >= 180 ? 'STEAM' : temp >= 90 ? 'SOAK' : 'STOPPED') : 'PRODUCTION');
  const isInjecting = activeStage === 'STEAM';
  const isSoaking = activeStage === 'SOAK';
  const isHotFlush = activeStage === 'PRODUCTION' && temp >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel rounded-xl p-5 space-y-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/70" />

      {/* Top Header & Simulation Loop Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-sm">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Simulator Runtime Control Cockpit
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                PORT 3001
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive setpoint dispatch to well physics simulator &amp; thermal decay model
            </p>
          </div>
        </div>

        {/* Status Message & Loop Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <AnimatePresence>
            {lastMessage && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl text-[11px] flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {lastMessage}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => controlLoop('start')}
            disabled={loadingParam === 'loop_start'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium transition shadow-sm font-mono"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> RESUME
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => controlLoop('stop')}
            disabled={loadingParam === 'loop_stop'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-medium transition shadow-sm font-mono"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> PAUSE
          </motion.button>
        </div>
      </div>

      {/* CYCLIC STEAM STIMULATION (CSS) LIFECYCLE CONTROLLER */}
      <div className="glass-panel-sub border border-amber-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 tracking-wider">
              CSS LIFECYCLE CONTROLLER
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 font-medium">Stage:</span>
            {isInjecting && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" /> 1. STEAM INJECTION (HUFF)
              </span>
            )}
            {isSoaking && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse flex items-center gap-1">
                <Hourglass className="w-3 h-3 text-amber-400" /> 2. THERMAL SOAKING
              </span>
            )}
            {isHotFlush && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> 3. HOT FLUSH (PUFF)
              </span>
            )}
            {!isInjecting && !isSoaking && !isHotFlush && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                {isPumpStopped ? 'Pump Stopped / Shut-In' : 'Steady Production'}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Stage 1: Inject Steam */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyCssStage('STEAM')}
            disabled={loadingParam === 'css_STEAM'}
            className={`flex items-center justify-between p-3 rounded-xl border transition ${
              isInjecting
                ? 'bg-rose-500/20 border-rose-500/60 ring-2 ring-rose-500/40 text-white shadow-lg glow-rose'
                : 'bg-slate-900/80 border-slate-800 hover:border-rose-500/40 text-slate-200'
            }`}
          >
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
              <Flame className="w-4 h-4" /> 1. Steam Injection
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold">
              PUMP OFF
            </span>
          </motion.button>

          {/* Stage 2: Soak Well */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyCssStage('SOAK')}
            disabled={loadingParam === 'css_SOAK'}
            className={`flex items-center justify-between p-3 rounded-xl border transition ${
              isSoaking
                ? 'bg-amber-500/20 border-amber-500/60 ring-2 ring-amber-500/40 text-white shadow-lg glow-amber'
                : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-slate-200'
            }`}
          >
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
              <Hourglass className="w-4 h-4" /> 2. Soak (Shut-In)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
              PUMP OFF
            </span>
          </motion.button>

          {/* Stage 3: Restart Production */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyCssStage('PRODUCTION')}
            disabled={loadingParam === 'css_PRODUCTION'}
            className={`flex items-center justify-between p-3 rounded-xl border transition ${
              isHotFlush
                ? 'bg-emerald-500/20 border-emerald-500/60 ring-2 ring-emerald-500/40 text-white shadow-lg glow-emerald'
                : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-slate-200'
            }`}
          >
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
              <Play className="w-4 h-4 fill-current" /> 3. Production (Puff)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
              PUMP ON
            </span>
          </motion.button>
        </div>
      </div>

      {/* Quick Scenarios */}
      <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5">
        <span className="text-slate-400 block text-[11px] mb-2 font-mono font-semibold flex items-center gap-1.5 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> One-Click Digital Twin Scenarios:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => applyScenario('Hot Steam Flush', { temperature_c: 85, spm: 5.5, tubing_pressure_bar: 22 })}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition flex items-center gap-1 font-mono text-[11px]"
          >
            <Flame className="w-3 h-3 text-rose-400" /> Hot Steam Flush (85°C)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => applyScenario('Cold Viscous Trap', { temperature_c: 32, spm: 6.5, tubing_pressure_bar: 25 })}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition flex items-center gap-1 font-mono text-[11px]"
          >
            <Snowflake className="w-3 h-3 text-amber-400" /> Cold Shock (32°C)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => applyScenario('High-Speed Pumping', { vfd_frequency_hz: 55, spm: 7.5, stroke_length_m: 2.8 })}
            className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 transition flex items-center gap-1 font-mono text-[11px]"
          >
            <Settings className="w-3 h-3 text-sky-400" /> High-Speed (7.5 SPM)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => applyScenario('Deep Fluid Drawdown', { fluid_level_m: 1050, tubing_pressure_bar: 30 })}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition flex items-center gap-1 font-mono text-[11px]"
          >
            <Droplets className="w-3 h-3 text-indigo-400" /> Deep Drawdown (1050m)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              applyScenario('Baseline Reset', {
                temperature_c: 50,
                spm: 5.5,
                vfd_frequency_hz: 40,
                stroke_length_m: 2.5,
                tubing_pressure_bar: 18.5,
                fluid_level_m: 850,
              })
            }
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition flex items-center gap-1 font-mono text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Reset Baseline
          </motion.button>
        </div>
      </div>

      {/* SECTION 1: OPERATOR SURFACE MACHINERY */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-sky-500/10 border border-sky-500/30 text-sky-300 tracking-wider">
            OPERATOR &bull; SURFACE MACHINERY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. SPM */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Pumping Speed (SPM)
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {spm <= 0.05 ? <span className="text-rose-400 font-bold">0.0 (OFF)</span> : `${spm.toFixed(1)} SPM`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setParam('spm', 0.0)}
                className={`px-2 py-1 rounded-lg border text-[11px] font-mono font-bold transition ${
                  spm <= 0.05
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-rose-400'
                }`}
              >
                0
              </button>
              <button
                onClick={() => setParam('spm', Math.max(0, Math.round((spm - 0.5) * 10) / 10))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setParam('spm', 3.5)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">3.5</button>
              <button onClick={() => setParam('spm', 5.5)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">5.5</button>
              <button onClick={() => setParam('spm', 7.5)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">7.5</button>
              <button onClick={() => setParam('spm', 9.5)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">9.5</button>
              <button
                onClick={() => setParam('spm', Math.min(15, Math.round((spm + 0.5) * 10) / 10))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. VFD */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" /> VFD Frequency (Hz)
              </span>
              <span className="font-mono font-bold text-sky-400 text-sm">
                {vfd <= 0.05 ? <span className="text-rose-400 font-bold">0.0 Hz (OFF)</span> : `${vfd.toFixed(1)} Hz`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setParam('vfd_frequency_hz', 0)}
                className={`px-2 py-1 rounded-lg border text-[11px] font-mono font-bold transition ${
                  vfd <= 0.05
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-rose-400'
                }`}
              >
                0Hz
              </button>
              <button
                onClick={() => setParam('vfd_frequency_hz', Math.max(0, Math.round(vfd - 5)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setParam('vfd_frequency_hz', 30)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">30Hz</button>
              <button onClick={() => setParam('vfd_frequency_hz', 40)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">40Hz</button>
              <button onClick={() => setParam('vfd_frequency_hz', 50)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">50Hz</button>
              <button onClick={() => setParam('vfd_frequency_hz', 60)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">60Hz</button>
              <button
                onClick={() => setParam('vfd_frequency_hz', Math.min(70, Math.round(vfd + 5)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Stroke Length */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Stroke Length (m)
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{stroke.toFixed(2)} m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setParam('stroke_length_m', Math.max(1.0, Math.round((stroke - 0.2) * 10) / 10))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setParam('stroke_length_m', 1.8)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">1.8m</button>
              <button onClick={() => setParam('stroke_length_m', 2.5)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">2.5m</button>
              <button onClick={() => setParam('stroke_length_m', 3.2)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">3.2m</button>
              <button onClick={() => setParam('stroke_length_m', 4.0)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">4.0m</button>
              <button
                onClick={() => setParam('stroke_length_m', Math.min(5.0, Math.round((stroke + 0.2) * 10) / 10))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: NATURE & DOWNHOLE DYNAMICS */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 tracking-wider">
            NATURE &bull; DOWNHOLE &amp; RESERVOIR DYNAMICS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Temperature */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Wellbore Temp (°C)
              </span>
              <span className="font-mono font-bold text-rose-400 text-sm">{temp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setParam('temperature_c', Math.max(20, Math.round(temp - 5)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setParam('temperature_c', 35)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">35°C</button>
              <button onClick={() => setParam('temperature_c', 50)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">50°C</button>
              <button onClick={() => setParam('temperature_c', 75)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">75°C</button>
              <button onClick={() => setParam('temperature_c', 95)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">95°C</button>
              <button
                onClick={() => setParam('temperature_c', Math.min(180, Math.round(temp + 5)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tubing Pressure */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" /> Tubing Pressure (bar)
              </span>
              <span className="font-mono font-bold text-sky-400 text-sm">{press.toFixed(1)} bar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setParam('tubing_pressure_bar', Math.max(5, Math.round(press - 5)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setParam('tubing_pressure_bar', 15)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">15 bar</button>
              <button onClick={() => setParam('tubing_pressure_bar', 25)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">25 bar</button>
              <button onClick={() => setParam('tubing_pressure_bar', 40)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">40 bar</button>
              <button onClick={() => setParam('tubing_pressure_bar', 60)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">60 bar</button>
              <button
                onClick={() => setParam('tubing_pressure_bar', Math.min(90, Math.round(press + 5)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Fluid Level Depth */}
          <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Fluid Level Depth (m)
              </span>
              <span className="font-mono font-bold text-indigo-400 text-sm">{fluidLevel.toFixed(0)} m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setParam('fluid_level_m', Math.max(300, Math.round(fluidLevel - 50)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setParam('fluid_level_m', 650)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">650m</button>
              <button onClick={() => setParam('fluid_level_m', 850)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">850m</button>
              <button onClick={() => setParam('fluid_level_m', 1050)} className="flex-1 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">1050m</button>
              <button
                onClick={() => setParam('fluid_level_m', Math.min(1150, Math.round(fluidLevel + 50)))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
