'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  title?: string;
  category?: 'ANALYTICS' | 'PREDICTION' | 'CONTROL';
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  category,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        className="inline-flex items-center cursor-help focus:outline-none transition-transform active:scale-95"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={title || 'Information'}
      >
        {children || <Info className="w-3.5 h-3.5 text-slate-400 hover:text-sky-400 transition" />}
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3.5 bg-[#1c2633] border border-[#4a5d73] rounded-lg shadow-xl text-left pointer-events-none">
          <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-slate-100 tracking-wide">
              {title || 'Information'}
            </span>
            {category && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase font-semibold tracking-wider ${
                  category === 'ANALYTICS'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : category === 'PREDICTION'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {category}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
            {content}
          </p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};
