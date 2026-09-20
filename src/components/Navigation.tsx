import React from 'react';
import { Radio, Sparkles, LayoutDashboard, Film, Zap } from 'lucide-react';
import { ViewMode } from '../types';

export default function Navigation({
  currentView,
  onNavigate
}: {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              FLUID MOTION TV
            </span>
            <span className="text-[10px] text-slate-500 font-mono block -mt-0.5">
              Dragon Nine Studio Engine
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onNavigate('horizon')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              currentView === 'horizon'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Horizon Broadcast</span>
          </button>

          <button
            onClick={() => onNavigate('lotus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              currentView === 'lotus'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lotus 4K Visualizer</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              currentView === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
