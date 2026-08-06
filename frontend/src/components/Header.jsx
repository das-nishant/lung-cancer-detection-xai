import React from 'react';
import { Activity, ShieldCheck, RefreshCw, Stethoscope, BarChart2, FolderPlus, Settings } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, healthStatus, onRefresh }) {
  return (
    <header className="no-print glass-card mb-8 px-6 py-4 flex flex-wrap items-center justify-between gap-6 border-b border-cyan-500/20">
      {/* Brand & Workspace Title */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-cyan-400 animate-pulse-glow" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              PulmoXAI
            </h1>
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full shadow-inner">
              Clinical XAI v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            Explainable Deep Learning CT Scan Diagnostic System
          </p>
        </div>
      </div>

      {/* Navigation Tabs with Requested Icons */}
      <nav className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
            activeTab === 'workspace'
              ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          🩺 Diagnostic Workspace
        </button>
        
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          📊 Prediction History
        </button>

        <button
          onClick={() => setActiveTab('workspace')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 transition-colors"
          title="Quick Upload CT Scan"
        >
          <FolderPlus className="w-4 h-4 text-cyan-400" />
          📁 Upload Scan
        </button>

        <button
          onClick={() => alert('Settings configuration modal coming in next release.')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 transition-colors"
          title="System Settings (Future)"
        >
          <Settings className="w-4 h-4" />
          ⚙️ Settings
        </button>
      </nav>

      {/* System Status Indicators */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2.5 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className={`w-2.5 h-2.5 rounded-full ${healthStatus === 'healthy' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'}`}></span>
          <span className="font-semibold text-slate-200">
            {healthStatus === 'healthy' ? 'Engine Ready' : 'Connecting...'}
          </span>
          <button 
            onClick={onRefresh} 
            title="Refresh API Connection"
            className="p-1 text-slate-500 hover:text-cyan-400 transition-colors ml-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ResNet50 + Grad-CAM</span>
        </div>
      </div>
    </header>
  );
}
