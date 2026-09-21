'use client';

import React, { useState } from 'react';
import { useTelemetryWebSocket } from '@/hooks/useTelemetryWebSocket';
import { usePredictions } from '@/hooks/usePredictions';
import { OilDrillingIntro } from '@/components/OilDrillingIntro';
import { Header } from '@/components/Header';
import { HealthScoreGauge } from '@/components/HealthScoreGauge';
import { DynamometerCard } from '@/components/DynamometerCard';
import { TelemetryGraphs } from '@/components/TelemetryGraphs';
import { ThermalViscosityCard } from '@/components/ThermalViscosityCard';
import { PredictiveRiskPanel } from '@/components/PredictiveRiskPanel';
import { ProductionForecastPanel } from '@/components/ProductionForecastPanel';
import { OptimizationAdvisoryCard } from '@/components/OptimizationAdvisoryCard';
import { SimulatorControls } from '@/components/SimulatorControls';
import { Activity, Sparkles, Sliders, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [wellId] = useState('BW-001');
  const [activeTab, setActiveTab] = useState<'all' | 'analytics' | 'predictions' | 'simulator'>('all');
  const [showIntro, setShowIntro] = useState(true);

  const { latest, history, isConnected } = useTelemetryWebSocket(
    process.env.NEXT_PUBLIC_INGESTION_WS_URL,
    wellId,
  );

  const { analytics, predictions, healthScore, lastUpdated, refetch } = usePredictions(
    process.env.NEXT_PUBLIC_AI_API_URL,
    wellId,
    3000,
  );

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <OilDrillingIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200"
      >
        <Header
          wellId={wellId}
          isConnected={isConnected}
          latest={latest}
          lastUpdated={lastUpdated}
          onRefresh={refetch}
          onReplayIntro={() => setShowIntro(true)}
        />

        <main
          key={showIntro ? 'pre' : 'live'}
          className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1650px] w-full mx-auto"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-2 rounded-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-[#334155] text-white border border-[#5b6d82]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> All Overview
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-[#1d4f66] text-white border border-sky-500/40'
                    : 'text-slate-400 hover:text-sky-300 hover:bg-sky-500/8'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Real-Time Analytics</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'analytics' ? 'bg-black/25 text-white' : 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                }`}>15</span>
              </button>

              <button
                onClick={() => setActiveTab('predictions')}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'predictions'
                    ? 'bg-[#3d2d5c] text-white border border-purple-400/35'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/8'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Predictions &amp; Risk</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'predictions' ? 'bg-black/25 text-white' : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                }`}>13</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === 'simulator'
                    ? 'bg-[#1c4a40] text-white border border-emerald-400/35'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/8'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Simulator Controls
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Analytics (Current)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> Predictions (Future)
              </span>
            </div>
          </div>

          <AnimatePresence mode="sync">
          {(activeTab === 'all' || activeTab === 'analytics') && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#3d4d60]">
                <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-400">
                  <Activity className="w-4 h-4" />
                </span>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Real-Time Diagnostics &amp; Operational Analytics
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 font-mono">
                  15 Metrics Active
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HealthScoreGauge healthScore={healthScore} />
                <DynamometerCard analytics={analytics} latest={latest} />
              </div>

              <TelemetryGraphs history={history} />
            </motion.section>
          )}

          {(activeTab === 'all' || activeTab === 'predictions') && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.32, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 pt-2"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#3d4d60]">
                <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  AI Predictive Modeling &amp; Multi-Horizon Risk Outlook
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 font-mono">
                  13 Predictions Active
                </span>
              </div>

              <PredictiveRiskPanel predictions={predictions} />

              <ThermalViscosityCard
                analytics={analytics}
                predictions={predictions}
                latest={latest}
              />

              <ProductionForecastPanel predictions={predictions} />

              <OptimizationAdvisoryCard items={predictions?.optimization_advisory} />
            </motion.section>
          )}

          {(activeTab === 'all' || activeTab === 'simulator') && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.32, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 pt-2"
            >
              <SimulatorControls
                simulatorApiUrl={process.env.NEXT_PUBLIC_SIMULATOR_API_URL}
                latest={latest}
                onParameterChanged={refetch}
              />
            </motion.section>
          )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-[#3d4d60] bg-[#222c39] px-6 py-4 text-center text-xs text-slate-500 font-mono mt-10">
          THERMO-LIFT Prototype &bull; Real-time SRP &amp; CSS Well Digital Twin &bull; Baghewala Field Heavy Oil Pilot
        </footer>
      </motion.div>
    </>
  );
}
