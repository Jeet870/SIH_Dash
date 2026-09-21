'use client';

import React from 'react';
import { Thermometer, Droplets, Calendar, Flame, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnalyticsData, PredictionsData, TelemetryRecord } from '@/types/telemetry';
import { Tooltip } from './Tooltip';

interface ThermalViscosityCardProps {
  analytics?: AnalyticsData | null;
  predictions?: PredictionsData | null;
  latest?: TelemetryRecord | null;
}

export const ThermalViscosityCard: React.FC<ThermalViscosityCardProps> = ({
  analytics,
  predictions,
  latest,
}) => {
  const currentTemp = latest?.temperature_c ?? null;
  const currentVisc = latest?.viscosity_cp ?? null;
  const coolingRate = analytics?.cooling_rate?.cooling_rate_c_per_day ?? null;
  const viscosityTrend = analytics?.viscosity_trend?.viscosity_increase_rate_cp_per_day ?? null;

  const tempPred = predictions?.reservoir_temperature;
  const viscPred = predictions?.oil_viscosity;
  const resteamWindow = predictions?.reservoir_cooling?.recommended_css_resteam_window_days ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-rose-500/60" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300 tracking-wider">
            HYBRID &bull; STATE &amp; SHIFT FORECAST
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-rose-400" />
            Thermal Decay &amp; Viscosity Dynamics
          </h3>
          <Tooltip
            title="Thermal & Viscosity Dynamics"
            category="PREDICTION"
            content="Combines live bottomhole analytics with 6–72h conductive decay and Arrhenius viscosity forecasting. Updated every 15–60 min."
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          Re-steam in: <strong className="text-sky-300">{resteamWindow !== null ? `~${resteamWindow} days` : '--'}</strong>
          <Tooltip
            title="Recommended Re-Steam Window"
            category="PREDICTION"
            content="Estimated days until near-wellbore temperature decays below 55°C, where viscosity exceeds 15,000 cP and requires the next CSS steam injection cycle."
          />
        </div>
      </div>

      {/* 2 Primary Forecast Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Temperature Box */}
        <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Bottomhole Temperature
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">NOW</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                Decay: <strong className="text-rose-400">{coolingRate !== null ? `${coolingRate}°C/day` : '--'}</strong>
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="text-3xl font-black font-mono text-rose-400 tracking-tight">
                {currentTemp !== null ? `${currentTemp.toFixed(1)}°C` : '--'}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">6h - 72h Horizon</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80 text-[10px] font-mono mt-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">+6h</span>
                <span className="text-slate-200 font-bold text-xs">
                  {tempPred?.forecast_6h_c !== undefined ? `${tempPred.forecast_6h_c}°C` : '--'}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">+24h</span>
                <span className="text-rose-400 font-bold text-xs">
                  {tempPred?.forecast_24h_c !== undefined ? `${tempPred.forecast_24h_c}°C` : '--'}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">+72h</span>
                <span className="text-slate-400 font-bold text-xs">
                  {tempPred?.forecast_72h_c !== undefined ? `${tempPred.forecast_72h_c}°C` : '--'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-rose-300 font-mono text-center font-medium pt-1 truncate bg-rose-500/5 py-1 px-2 rounded-md border border-rose-500/10">
              {tempPred?.summary ?? (tempPred ? `Temperature tomorrow = ${tempPred.forecast_24h_c}°C` : 'Awaiting thermal model forecast...')}
            </p>
          </div>
        </div>

        {/* Viscosity Box */}
        <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-purple-400" /> Dynamic Viscosity
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">NOW</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                Trend: <strong className="text-purple-400">{viscosityTrend !== null ? `+${viscosityTrend} cP/d` : '--'}</strong>
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="text-3xl font-black font-mono text-purple-400 tracking-tight">
                {currentVisc !== null ? Math.round(currentVisc).toLocaleString() : '--'}{' '}
                <span className="text-xs font-normal text-slate-400">cP</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">6h - 72h Horizon</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80 text-[10px] font-mono mt-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">+6h</span>
                <span className="text-slate-200 font-bold text-xs">
                  {viscPred?.forecast_6h_cp !== undefined ? Math.round(viscPred.forecast_6h_cp).toLocaleString() : '--'}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">+24h</span>
                <span className="text-purple-400 font-bold text-xs">
                  {viscPred?.forecast_24h_cp !== undefined ? Math.round(viscPred.forecast_24h_cp).toLocaleString() : '--'}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[9px]">+72h</span>
                <span className="text-slate-400 font-bold text-xs">
                  {viscPred?.forecast_72h_cp !== undefined ? Math.round(viscPred.forecast_72h_cp).toLocaleString() : '--'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-purple-300 font-mono text-center font-medium pt-1 truncate bg-purple-500/5 py-1 px-2 rounded-md border border-purple-500/10">
              {viscPred?.summary ?? (viscPred ? `Viscosity tomorrow = ${Math.round(viscPred.forecast_24h_cp).toLocaleString()} cP` : 'Awaiting viscosity model forecast...')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
