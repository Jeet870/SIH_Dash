'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Flame, Droplets, ChevronRight, Zap } from 'lucide-react';

interface OpeningExperienceProps {
  onComplete: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'drilling' | 'emergence' | 'transition'>('drilling');
  const [telemetryLog, setTelemetryLog] = useState('DRILL RIG INITIALIZED: BAGHEWALA WELL BW-001 (1,150M)');

  useEffect(() => {
    // Check sessionStorage & reduced motion
    if (typeof window !== 'undefined') {
      const alreadySeen = sessionStorage.getItem('thermo_lift_intro_seen');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (alreadySeen || prefersReduced) {
        onComplete();
        return;
      }
    }

    // Sequence timeline:
    // 0.0s - 1.2s: Mechanical Drilling & Pumpjack Motion
    const t1 = setTimeout(() => {
      setPhase('emergence');
      setTelemetryLog('SUBTERRANEAN OIL FORMATION BREACHED &bull; HEAVY CRUDE SURGE DETECTED');
    }, 1300);

    // 1.3s - 2.6s: Oil emergence & fluid surge upward
    const t2 = setTimeout(() => {
      setPhase('transition');
      setTelemetryLog('INITIALIZING DIGITAL TWIN SENSOR TELEMETRY &bull; 100% SYNCHRONIZED');
    }, 2500);

    // 2.7s - 3.2s: Complete and enter dashboard
    const t3 = setTimeout(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('thermo_lift_intro_seen', 'true');
      }
      onComplete();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('thermo_lift_intro_seen', 'true');
    }
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-[#1c2430] flex flex-col items-center justify-between p-6 select-none overflow-hidden"
    >
      {/* Background Desert Night Horizon & Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b14_1px,transparent_1px),linear-gradient(to_bottom,#1e293b14_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020408] to-transparent pointer-events-none" />

      {/* Atmospheric Radial Lights */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#151b24] to-transparent pointer-events-none" />

      {/* Top Bar with System Protocol Status */}
      <div className="relative z-20 w-full max-w-6xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-sky-500/10 border border-amber-500/30 text-amber-400 shadow-sm">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-slate-100 tracking-wider flex items-center gap-2">
              THERMO-LIFT <span className="text-[10px] text-amber-400 font-mono">DIGITAL TWIN</span>
            </span>
            <span className="text-[10px] text-slate-400 block">Baghewala Field &bull; Jodhpur Sandstone Heavy Oil</span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition active:scale-95 shadow-sm"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Center Cinematic Oil Drilling Rig & Pumpjack */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-2xl text-center space-y-4">
        {/* Stylized Pumpjack & Derrick SVG Animation */}
        <div className="relative w-72 h-64 md:w-96 md:h-72 flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
            <defs>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Base & Samson Post (A-Frame) */}
            <line x1="80" y1="270" x2="320" y2="270" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <polygon points="180,270 220,270 205,120 195,120" fill="url(#metalGrad)" stroke="#475569" strokeWidth="2" />
            <line x1="185" y1="200" x2="215" y2="200" stroke="#475569" strokeWidth="2" />

            {/* Wellhead & Subterranean Borehole Entry */}
            <rect x="70" y="240" width="30" height="30" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="3" />
            <line x1="85" y1="270" x2="85" y2="295" stroke="#f59e0b" strokeWidth="4" strokeDasharray="3 3" />

            {/* Counterweight & Crank Wheel (Rotating) */}
            <g transform="translate(290, 220)">
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                <rect x="-8" y="-24" width="16" height="48" fill="#f59e0b" opacity="0.6" rx="3" />
                <circle cx="16" cy="0" r="5" fill="#38bdf8" />
              </motion.g>
            </g>

            {/* Walking Beam & Horsehead Assembly (Reciprocating Rocking Motion) */}
            <motion.g
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '200px', originY: '120px' }}
            >
              {/* Walking Beam Beam */}
              <polygon points="65,115 310,115 310,125 65,125" fill="url(#metalGrad)" stroke="#64748b" strokeWidth="2" />
              <circle cx="200" cy="120" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

              {/* Horsehead Curved Front Assembly */}
              <path
                d="M 65,120 C 50,110 50,70 65,60 C 70,60 70,120 65,120 Z"
                fill="url(#metalGrad)"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Bridle Cable & Polished Rod hanging down */}
              <line x1="56" y1="120" x2="85" y2="240" stroke="#94a3b8" strokeWidth="2.5" />
              <line x1="85" y1="240" x2="85" y2="270" stroke="#38bdf8" strokeWidth="3" />
            </motion.g>

            {/* Pitman Arm Connection */}
            <line x1="290" y1="120" x2="290" y2="220" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* Subsurface Drilling Target Glow */}
          <div className="absolute -bottom-2 left-1/4 transform -translate-x-1/2 w-16 h-4 bg-amber-500/40 blur-md rounded-full animate-pulse" />
        </div>

        {/* Phase Text Status */}
        <div className="space-y-1.5 font-mono">
          <motion.div
            key={telemetryLog}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-amber-400 flex items-center justify-center gap-2"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="tracking-wide" dangerouslySetInnerHTML={{ __html: telemetryLog }} />
          </motion.div>
          <p className="text-[11px] text-slate-400 tracking-wider">
            Sucker Rod Pump &bull; CSS Thermal Lift &bull; 1,150m Heavy Viscous Reservoir
          </p>
        </div>
      </div>

      {/* Heavy Crude Oil Emergence & Rising Fluid Surge Wave Layers */}
      <AnimatePresence>
        {(phase === 'emergence' || phase === 'transition') && (
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: phase === 'transition' ? '100%' : '75%' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden pointer-events-none"
          >
            {/* Organic Fluid Surface Wave 1 (Dark petroleum black with amber top edge) */}
            <svg
              className="absolute top-0 left-0 w-[200%] h-20 -translate-y-12 animate-[wave_4s_linear_infinite]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C150,90 350,-40 500,45 C650,130 900,-20 1200,30 L1200,120 L0,120 Z"
                fill="#0a0f1d"
              />
            </svg>

            {/* Organic Fluid Surface Wave 2 (Viscous golden amber refraction) */}
            <svg
              className="absolute top-0 left-0 w-[200%] h-24 -translate-y-16 opacity-70 animate-[wave_6s_linear_infinite_reverse]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,30 C200,-20 400,110 600,20 C800,-70 1000,80 1200,15 L1200,120 L0,120 Z"
                fill="url(#oilGlow)"
              />
              <defs>
                <linearGradient id="oilGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Deep Heavy Crude Body */}
            <div className="w-full h-full bg-gradient-to-b from-[#0a0f1d] via-[#070b14] to-[#04060b] flex flex-col items-center justify-center p-6 text-center shadow-[0_-20px_50px_rgba(217,119,6,0.2)]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 font-mono"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Droplets className="w-4 h-4 text-amber-400 animate-bounce" />
                  HEAVY CRUDE DIGITAL TWIN ACTIVE (10,000+ cP)
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  ENTERING THERMO-LIFT OPERATIONS CONSOLE
                </h2>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span>● CSS Model: Coupled</span>
                  <span>● Dyno Loop: Live</span>
                  <span>● AI Guard: Armed</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Telemetry Bus Status Footer */}
      <div className="relative z-20 w-full max-w-6xl flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PORT 3002 BUS CONNECTED</span>
        </div>
        <div className="flex items-center gap-4">
          <span>SPM: 5.5</span>
          <span>ROD LOAD: 65.3 kN</span>
          <span>TEMP: 50.0°C</span>
        </div>
      </div>
    </motion.div>
  );
};
