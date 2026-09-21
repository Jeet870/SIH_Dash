'use client';

import React from 'react';
import { TrendingDown, Zap, Flame, BarChart2, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { PredictionsData } from '@/types/telemetry';
import { Tooltip } from './Tooltip';

interface ProductionForecastPanelProps {
  predictions?: PredictionsData | null;
}

export const ProductionForecastPanel: React.FC<ProductionForecastPanelProps> = ({ predictions }) => {
  const prod = predictions?.production_rate;
  const energy = predictions?.energy_consumption;
  const cooling = predictions?.reservoir_cooling;
  const sor = predictions?.sor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500/70" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300 tracking-wider">
            PREDICTION &bull; OPERATIONAL &amp; CYCLE
          </span>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            Operational Production, Thermal &amp; Energy Forecast
          </h3>
          <Tooltip
            title="Operational & Cycle Forecasts"
            category="PREDICTION"
            content="Multi-tier horizons: 6–24 h shift forecasts for production and energy intensity; 1–7 days strategic forecasts for thermal cooling rate and steam-oil ratio (SOR)."
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-wider">SHIFT (6–24H) &amp; CYCLE (1–7D) HORIZONS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* 1. Production Forecast (Next 6-24 h) */}
        <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-400" /> Production (BOPD)
                <Tooltip
                  title="BOPD Forecast (Next 6–24 h)"
                  category="PREDICTION"
                  content="Forecasted oil production over the next 6 to 24 hours as crude cools and viscosity shifts. Updated every 15–60 min."
                />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {prod?.current_bopd !== undefined ? `${prod.current_bopd} Now` : '--'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">Next 6–24 h</span>
              <span>&bull; Upd: 15–60m</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-400">
                +6h: <strong className="text-slate-100">{prod?.forecast_6h_bopd !== undefined ? `${prod.forecast_6h_bopd} bbl` : '--'}</strong>
              </span>
              <span className="text-slate-400">
                +24h: <strong className="text-emerald-400">{prod?.forecast_24h_bopd !== undefined ? `${prod.forecast_24h_bopd} bbl` : '--'}</strong>
              </span>
            </div>
            <p className="text-[11px] text-emerald-300 font-mono font-medium pt-0.5 border-t border-slate-800 truncate">
              {prod?.summary ?? (prod?.forecast_range_24h ? `Next 24 h: ${prod.forecast_range_24h}` : 'Awaiting production forecast...')}
            </p>
          </div>
        </div>

        {/* 2. Specific Energy (Next 6-24 h) */}
        <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" /> Energy (kWh/bbl)
                <Tooltip
                  title="Energy Intensity (Next 6–24 h)"
                  category="PREDICTION"
                  content="Lifting power per barrel over the next 6–24 hours. Motor load rises as viscous drag increases with wellbore cooling. Updated every 15–60 min."
                />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                {energy?.current_kwh_per_bbl !== undefined ? `${energy.current_kwh_per_bbl} Now` : '--'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300">Next 6–24 h</span>
              <span>&bull; Upd: 15–60m</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-400">
                +6h: <strong className="text-slate-100">{energy?.forecast_6h_kwh_per_bbl !== undefined ? `${energy.forecast_6h_kwh_per_bbl}` : '--'}</strong>
              </span>
              <span className="text-slate-400">
                +24h: <strong className="text-sky-400">{energy?.forecast_24h_kwh_per_bbl !== undefined ? `${energy.forecast_24h_kwh_per_bbl}` : '--'}</strong>
              </span>
            </div>
            <p className="text-[11px] text-sky-300 font-mono font-medium pt-0.5 border-t border-slate-800 truncate">
              {energy?.summary ?? (energy?.forecast_24h_kwh_per_bbl !== undefined ? `Tomorrow = ${energy.forecast_24h_kwh_per_bbl} kWh/bbl` : 'Awaiting energy forecast...')}
            </p>
          </div>
        </div>

        {/* 3. Cooling Rate (Next 1-7 days) */}
        <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-400" /> Cooling Rate
                <Tooltip
                  title="Reservoir Cooling Rate (Next 1–7 days)"
                  category="PREDICTION"
                  content="Thermal decay rate over the next 1–7 days. Updated every 1–6 hours. Drives future viscosity increase and re-steaming timing."
                />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {cooling?.cooling_rate_c_per_day !== undefined ? `${cooling.cooling_rate_c_per_day}°C/d` : '--'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">Next 1–7 days</span>
              <span>&bull; Upd: 1–6h</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-1.5">
            <p className="text-[11px] text-amber-300 font-mono font-medium truncate">
              {cooling?.summary ?? (cooling?.cooling_rate_c_per_day !== undefined ? `Cooling = ${cooling.cooling_rate_c_per_day}°C/day` : 'Awaiting cooling rate model...')}
            </p>
            <span className="text-[10px] text-slate-400 block font-mono border-t border-slate-800 pt-1">
              Re-steam: <strong className="text-amber-400">{cooling?.recommended_css_resteam_window_days !== undefined ? `~${cooling.recommended_css_resteam_window_days} days` : '--'}</strong>
            </span>
          </div>
        </div>

        {/* 4. Future SOR (Next 1-7 days) */}
        <div className="glass-panel-sub border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" /> Cycle SOR
                <Tooltip
                  title="Future Steam-to-Oil Ratio (Next 1–7 days)"
                  category="PREDICTION"
                  content="Forecasts cumulative steam injected vs oil recovered over next 1–7 days. Updated every 1–6 hours."
                />
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {sor?.current_sor_forecast !== undefined ? `${sor.current_sor_forecast} Ratio` : '--'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-300">Next 1–7 days</span>
              <span>&bull; Upd: 1–6h</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-1.5">
            <p className="text-[11px] text-rose-300 font-mono font-medium truncate">
              {sor?.summary ?? (sor?.projected_cycle_end_sor !== undefined ? `Expected SOR = ${sor.projected_cycle_end_sor}` : 'Awaiting SOR forecast...')}
            </p>
            <span className="text-[10px] text-slate-400 block font-mono border-t border-slate-800 pt-1 truncate">
              Status: <span className="text-rose-400 font-medium">{sor?.efficiency_status ? sor.efficiency_status.replace(/_/g, ' ') : '--'}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
