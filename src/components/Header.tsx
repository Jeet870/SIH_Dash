'use client';

import React, { useState } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Flame,
  Hourglass,
  Play,
  Cpu,
  Zap,
  Droplets,
  Thermometer,
  Bell,
  User,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelemetryRecord } from '@/types/telemetry';

interface HeaderProps {
  wellId: string;
  isConnected: boolean;
  latest: TelemetryRecord | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wellId,
  isConnected,
  latest,
  lastUpdated,
  onRefresh,
  onReplayIntro,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const notifications = [
    { time: '1m ago', msg: 'Baghewala Well BW-001: Viscosity stable @ 10,240 cP', type: 'info' },
    { time: '3m ago', msg: 'CSS Cycle Stage: Production (Puff) active', type: 'success' },
    { time: '5m ago', msg: 'Goodman Fatigue: Cycles to failure > 450k', type: 'info' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#243140]/95 border-b border-[#3d4d60] px-4 md:px-6 py-3 backdrop-blur-md">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-[#1d4f66]/40 border border-sky-500/30 rounded-lg text-sky-300"
          >
            <Cpu className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-xl font-bold tracking-tight text-[#f3e6d0] flex items-center gap-2 font-mono">
                <span>THERMO-LIFT</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-sky-500/10 border border-sky-500/30 text-sky-300 tracking-wider">
                DIGITAL TWIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium font-mono hidden sm:block">
              Baghewala Field, Rajasthan &bull; Jodhpur Sandstone &bull; Heavy Oil CSS-SRP
            </p>
          </div>
        </div>

        {/* Live Telemetry Ticker Strip */}
        <AnimatePresence>
          {latest && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden 2xl:flex items-center gap-3 glass-panel-sub px-4 py-1.5 rounded-lg text-xs"
            >
              {/* CSS Stage */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-slate-400 text-[10px] font-mono">STAGE</span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded-full text-[10px] border ${
                    latest.operating_stage === 'STEAM'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : latest.operating_stage === 'SOAK'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {latest.operating_stage || (latest.spm <= 0.05 ? 'STOPPED' : 'PROD')}
                </span>
              </div>

              <div className="h-5 w-px bg-slate-800" />

              {/* SPM */}
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-mono">SPM</span>
                  <span className="font-bold font-mono text-sky-300">
                    {latest.spm <= 0.05 ? '0.0 (OFF)' : latest.spm.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="h-5 w-px bg-slate-800" />

              {/* ROD LOAD */}
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-mono">ROD LOAD</span>
                  <span className="font-bold font-mono text-amber-300">{latest.rod_load_kn.toFixed(1)} kN</span>
                </div>
              </div>

              <div className="h-5 w-px bg-slate-800" />

              {/* PRODUCTION */}
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-mono">BOPD</span>
                  <span className="font-bold font-mono text-emerald-300">{latest.production_bopd.toFixed(1)}</span>
                </div>
              </div>

              <div className="h-5 w-px bg-slate-800" />

              {/* TEMPERATURE */}
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <div>
                  <span className="text-slate-400 block text-[9px] font-mono">TEMP</span>
                  <span className="font-bold font-mono text-rose-300">{latest.temperature_c.toFixed(1)}°C</span>
                </div>
              </div>

              <div className="h-5 w-px bg-slate-800" />

              {/* VISCOSITY */}
              <div>
                <span className="text-slate-400 block text-[9px] font-mono">VISCOSITY</span>
                <span className="font-bold font-mono text-purple-300">
                  {Math.round(latest.viscosity_cp).toLocaleString()} cP
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicators & Action Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Well ID Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="font-semibold">WELL: {wellId}</span>
          </div>

          {/* Live WS Status Pill with Multi-Ring Radar Pulse */}
          <div
            className={`relative flex items-center gap-2 px-3 py-1 rounded-xl border text-[11px] font-mono font-medium transition-colors ${
              isConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {isConnected ? (
              <>
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                  <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-radar" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">WS LIVE</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">OFFLINE</span>
              </>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-[#222c39] border border-[#3d4d60] hover:border-[#5b6d82] text-slate-400 hover:text-white transition-all duration-150 active:scale-95 relative"
              title="Notifications & Alerts"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 glass-panel p-3 rounded-2xl border border-slate-700 shadow-2xl z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-xs font-bold text-white font-mono">
                  <span>SYSTEM ALERTS</span>
                  <span className="text-[10px] text-sky-400">3 ACTIVE</span>
                </div>
                <div className="space-y-1.5">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-0.5">
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>BAGHEWALA SCADA</span>
                        <span>{n.time}</span>
                      </div>
                      <p className="text-slate-200 leading-tight">{n.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Refresh Action with Spin Animation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-[#222c39] border border-[#3d4d60] hover:border-[#5b6d82] text-slate-400 hover:text-white transition-all duration-150"
            title="Refresh AI predictions & Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </motion.button>

          {/* Operator Profile Avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 border border-sky-400/40 flex items-center justify-center text-white shadow-sm font-mono text-xs font-bold">
              <User className="w-4 h-4 text-sky-200" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
