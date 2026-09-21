'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OilDrillingIntroProps {
  onComplete: () => void;
}

type AnimationStage =
  | 'intro'
  | 'drilling'
  | 'oil-emerging'
  | 'oil-spreading'
  | 'completing'
  | 'dashboard';

export function OilDrillingIntro({ onComplete }: OilDrillingIntroProps) {
  const [stage, setStage] = useState<AnimationStage>('intro');
  const [isDone, setIsDone] = useState(false);
  const isCompletedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const triggerComplete = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setStage('completing');
    try {
      onComplete();
    } catch (err) {
      console.error('Error in onComplete callback:', err);
    }
    const hideId = setTimeout(() => {
      setIsDone(true);
      setStage('dashboard');
    }, 600);
    timeoutsRef.current.push(hideId);
  }, [onComplete]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        triggerComplete();
        return;
      }
    }

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const addTimeout = (fn: () => void, delayMs: number) => {
      const id = setTimeout(fn, delayMs);
      timeoutsRef.current.push(id);
      return id;
    };

    addTimeout(() => {
      if (!isCompletedRef.current) setStage('drilling');
    }, 350);

    addTimeout(() => {
      if (!isCompletedRef.current) setStage('oil-emerging');
    }, 2750);

    addTimeout(() => {
      if (!isCompletedRef.current) setStage('oil-spreading');
    }, 3250);

    addTimeout(() => {
      if (!isCompletedRef.current) {
        setStage('completing');
        triggerComplete();
      }
    }, 4800);

    addTimeout(() => {
      triggerComplete();
    }, 5200);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [triggerComplete]);

  if (isDone || stage === 'dashboard') {
    return null;
  }

  const isPumping = stage === 'drilling' || stage === 'oil-emerging' || stage === 'oil-spreading';
  const showPuddle = stage === 'oil-emerging' || stage === 'oil-spreading' || stage === 'completing';
  const showFlood = stage === 'oil-spreading' || stage === 'completing';

  return (
    <AnimatePresence>
      <motion.div
        key="oil-drilling-intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'completing' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] overflow-hidden bg-white select-none"
        style={{ pointerEvents: stage === 'completing' ? 'none' : 'auto' }}
      >
        <button
          type="button"
          onClick={triggerComplete}
          className="absolute top-5 right-5 z-50 px-3 py-1 rounded-full text-[11px] font-mono tracking-wide bg-stone-900/5 hover:bg-stone-900/12 text-stone-400 hover:text-stone-800 border border-stone-200/90 transition-all duration-150 cursor-pointer"
        >
          Skip &rarr;
        </button>

        <div className="absolute inset-0 flex flex-col justify-end">
          <div
            className="relative h-[28vh] w-full"
            style={{
              background:
                'linear-gradient(180deg, #d7cbb6 0%, #b7a48a 38%, #6f624f 100%)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#4a4034]" />
            <div className="absolute top-[7px] left-[8%] right-[8%] h-px bg-[#8a7b68]/50" />
          </div>
        </div>

        <div className="absolute left-1/2 bottom-[22vh] z-10 w-[min(400px,78vw)] -translate-x-1/2">
          <svg
            viewBox="0 0 400 240"
            className="w-full h-auto overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="steel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3a4554" />
                <stop offset="100%" stopColor="#1b222c" />
              </linearGradient>
              <linearGradient id="horse" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4b483" />
                <stop offset="100%" stopColor="#9a7544" />
              </linearGradient>
              <linearGradient id="rodChrome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7b8896" />
                <stop offset="50%" stopColor="#e8eef4" />
                <stop offset="100%" stopColor="#5b6774" />
              </linearGradient>
            </defs>

            <rect x="72" y="206" width="86" height="8" rx="1.5" fill="#1b222c" />
            <rect x="186" y="206" width="128" height="8" rx="1.5" fill="#1b222c" />
            <rect x="82" y="188" width="42" height="18" rx="2" fill="url(#steel)" stroke="#1b222c" strokeWidth="1.5" />

            <g className={isPumping ? 'pump-crank' : undefined}>
              <circle cx="118" cy="168" r="16" fill="#2a3340" stroke="#1b222c" strokeWidth="2" />
              <line x1="118" y1="168" x2="118" y2="136" stroke="#1b222c" strokeWidth="6" strokeLinecap="round" />
              <path
                d="M102 132 C102 118 134 118 134 132 C134 142 102 142 102 132 Z"
                fill="url(#horse)"
                stroke="#1b222c"
                strokeWidth="1.8"
              />
            </g>

            <line x1="210" y1="92" x2="168" y2="206" stroke="#1b222c" strokeWidth="7" strokeLinecap="round" />
            <line x1="210" y1="92" x2="258" y2="206" stroke="#1b222c" strokeWidth="7" strokeLinecap="round" />
            <line x1="186" y1="158" x2="238" y2="158" stroke="#4a5666" strokeWidth="3" />
            <circle cx="210" cy="92" r="7" fill="#4a5666" stroke="#1b222c" strokeWidth="2" />

            <g className={isPumping ? 'pump-nod' : undefined}>
              <path d="M88 88 L318 86 L310 98 L96 100 Z" fill="url(#steel)" stroke="#1b222c" strokeWidth="1.8" />
              <circle cx="92" cy="94" r="4" fill="#4a5666" stroke="#1b222c" />
              <path d="M310 92 L322 68 L348 56 L338 118 Z" fill="#1b222c" />
              <path
                d="M322 68 C338 56 352 50 360 48 C356 82 350 108 322 118 C332 100 334 80 322 68 Z"
                fill="url(#horse)"
                stroke="#1b222c"
                strokeWidth="1.8"
              />
            </g>

            <line x1="118" y1="168" x2="92" y2="94" stroke="#1b222c" strokeWidth="4.5" strokeLinecap="round" />

            <rect x="306" y="186" width="24" height="20" rx="1.5" fill="#1b222c" />
            <rect x="300" y="178" width="36" height="10" rx="1.5" fill="#2a3340" stroke="#1b222c" />

            <g className={isPumping ? 'pump-rod' : undefined}>
              <line x1="316" y1="78" x2="318" y2="132" stroke="#5b6774" strokeWidth="1.6" />
              <line x1="324" y1="78" x2="322" y2="132" stroke="#5b6774" strokeWidth="1.6" />
              <rect x="313" y="130" width="14" height="5" rx="1" fill="#1b222c" />
              <line x1="320" y1="135" x2="320" y2="186" stroke="url(#rodChrome)" strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {showPuddle && (
              <g className="oil-puddle">
                <ellipse cx="318" cy="214" rx="42" ry="10" fill="#0a0a0a" />
                <ellipse cx="318" cy="212" rx="28" ry="6" fill="#111111" />
              </g>
            )}
          </svg>
        </div>

        <AnimatePresence>
          {showFlood && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.55, ease: [0.4, 0.05, 0.2, 1] }}
              className="absolute inset-0 z-40 pointer-events-none oil-rise"
            >
              <svg
                className="absolute -top-10 left-0 w-full h-16"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0,36 C180,8 320,58 520,32 C720,8 880,60 1100,28 C1260,8 1380,42 1440,30 L1440,80 L0,80 Z"
                  fill="#000000"
                />
              </svg>
              <div className="absolute inset-0 bg-black" style={{ top: '2.2rem' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default OilDrillingIntro;
