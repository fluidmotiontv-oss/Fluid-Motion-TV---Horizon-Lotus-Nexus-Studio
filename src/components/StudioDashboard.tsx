import React from 'react';
import {
  Radio,
  Sparkles,
  Clock,
  Waves,
  ShieldCheck,
  Zap,
  Film,
  Music,
  Download,
  Terminal,
  Activity,
  ArrowRight,
  Globe,
  Layers,
  Cpu
} from 'lucide-react';
import { ViewMode } from '../types';
import { SCENES } from './LotusNexusPiano';

export default function StudioDashboard({ onNavigate }: { onNavigate: (view: ViewMode) => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pt-20 pb-16 px-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Unified Broadcast & Render Studio
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Fluid Motion TV Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dragon Nine Engine • Horizon Broadcast Stage • Lotus Nexus 4K Generator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('horizon')}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Radio className="w-4 h-4" /> Horizon Stage
          </button>
          <button
            onClick={() => onNavigate('lotus')}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Lotus 4K Studio
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {/* Stage 1: Horizon Broadcast */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30 uppercase font-bold">
              Live Stage
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
              Horizon Broadcast Stage
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              4K scroll-driven live broadcast surface with real-time WebGL plasma, particle geometry, Tide Oracle feed, and Kimi & Timi teleprompter.
            </p>
          </div>
          <ul className="text-[11px] font-mono text-slate-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> D9 26.667h Clock (54m hour)
            </li>
            <li className="flex items-center gap-2">
              <Waves className="w-3.5 h-3.5 text-cyan-400" /> Live River Bar Tide Crossing
            </li>
            <li className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Teleprompter with speed controls
            </li>
          </ul>
          <button
            onClick={() => onNavigate('horizon')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4"
          >
            Enter Broadcast Stage <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Stage 2: Lotus Nexus Piano */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4 group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-500/30 uppercase font-bold">
              4K Content Factory
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
              Lotus Nexus Piano 4K
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              30 unique generative harmonic compositions with synchronized 4K lotus mandala visualizer, particle bloom physics, and automated batch recording.
            </p>
          </div>
          <ul className="text-[11px] font-mono text-slate-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-amber-400" /> Web Audio generative synthesis
            </li>
            <li className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-amber-400" /> 3840×2160 60FPS MediaRecorder
            </li>
            <li className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> 30 Composition Presets Library
            </li>
          </ul>
          <button
            onClick={() => onNavigate('lotus')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4"
          >
            Launch 4K Visualizer <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Stage 3: Sovereign Telemetry */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase font-bold">
              Infrastructure
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Sovereign Mesh Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time monitoring of Dragon Nine cycle time, Tide Oracle bar crossing safety, and mesh gateway signal health.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Horizon Plasma Engine', val: '94% Nominal', color: 'text-cyan-400' },
              { label: 'Dragon Nine Clock Sync', val: '26.667h Locked', color: 'text-emerald-400' },
              { label: 'Tide Oracle Feed', val: '1.80m Depth', color: 'text-amber-400' },
              { label: 'Sovereign Gateway', val: '99.9% Online', color: 'text-purple-400' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400">{stat.label}</span>
                <span className={`font-bold ${stat.color}`}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30 Compositions Grid Preview */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              Lotus Nexus 30-Composition Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generative presets ready for automated batch 4K video rendering
            </p>
          </div>
          <button
            onClick={() => onNavigate('lotus')}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/30 transition-all"
          >
            Start Batch Render
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SCENES.map((s) => (
            <div
              key={s.id}
              onClick={() => onNavigate('lotus')}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all hover:scale-[1.02] space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>#{s.id.toString().padStart(2, '0')}</span>
                <span>{s.tempo} BPM</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{s.name}</div>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400">
                <span>{s.petals} Petals</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgb(${s.color.join(',')})` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post-Processing Stitch Script Reference */}
      <div className="mt-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-cyan-400">
          <Terminal className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">
            FFmpeg 4K Stitching Script (90-Minute Feature Film)
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Once the 30 scenes are rendered by the batch generator, run this Python/FFmpeg script locally or on your server to crossfade all clips into a single seamless 90-minute 4K release.
        </p>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`# stitch_lotus_nexus_4k.py
import os, subprocess

files = sorted([f for f in os.listdir('.') if f.startswith('Lotus_Nexus_4K_Scene_') and f.endswith('.webm')])
print(f"Found {len(files)} 4K composition scenes.")

with open('filelist.txt', 'w') as f:
    for file in files:
        f.write(f"file '{file}'\\n")

cmd = "ffmpeg -f concat -safe 0 -i filelist.txt -c copy -aspect 16:9 Lotus_Nexus_4K_90Min_Feature.mp4"
subprocess.run(cmd, shell=True)`}
        </pre>
      </div>
    </div>
  );
}
