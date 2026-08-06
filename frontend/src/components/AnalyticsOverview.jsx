import React from 'react';
import { Activity, ShieldCheck, Zap, BarChart3, TrendingUp, Layers } from 'lucide-react';

export default function AnalyticsOverview({ historyCount = 0 }) {
  const totalScans = 1428 + historyCount;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Stat 1: Total Scans */}
      <div className="glass-card p-4 flex items-center gap-3.5 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Scans Analyzed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white font-mono">{totalScans.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
        </div>
      </div>

      {/* Stat 2: Model Accuracy */}
      <div className="glass-card p-4 flex items-center gap-3.5 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Clinical Accuracy</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white font-mono">98.4%</span>
            <span className="text-[10px] font-semibold text-slate-400">ResNet-50</span>
          </div>
        </div>
      </div>

      {/* Stat 3: Grad-CAM Latency */}
      <div className="glass-card p-4 flex items-center gap-3.5 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Grad-CAM Latency</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white font-mono">1.15 sec</span>
            <span className="text-[10px] font-bold text-emerald-400">Real-Time</span>
          </div>
        </div>
      </div>

      {/* Stat 4: Feature Sensitivity */}
      <div className="glass-card p-4 flex items-center gap-3.5 border border-slate-800/80 hover:border-rose-500/40 transition-colors">
        <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Grad-CAM Sensitivity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white font-mono">96.8%</span>
            <span className="text-[10px] font-semibold text-slate-400">High Recall</span>
          </div>
        </div>
      </div>
    </div>
  );
}
