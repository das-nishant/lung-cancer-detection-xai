import React from 'react';
import { Activity, ShieldCheck, RefreshCw, LayoutDashboard, History, FileText, ChevronDown, Cpu } from 'lucide-react';

export default function TopNavigation({ activeTab, setActiveTab, healthStatus, onRefresh }) {
  return (
    <header className="no-print h-[72px] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
      <div className="w-full h-full px-6 sm:px-8 flex items-center justify-between">

        {/* Left: PulmoXAI Logo & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-teal-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-sans">PulmoXAI</h1>
              <span className="text-[10px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Explainable Deep Learning CT Analysis
            </p>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Prediction History
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Reports
          </button>
        </nav>

        {/* Right: AI Status, Model Selector & User Menu */}
        <div className="flex items-center gap-3">
          {/* AI Status */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${healthStatus === 'healthy' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <span className="font-semibold text-slate-200">
              {healthStatus === 'healthy' ? 'AI Engine Online' : 'Connecting...'}
            </span>
            <button onClick={onRefresh} title="Refresh connection" className="p-0.5 text-slate-400 hover:text-cyan-400 transition-colors ml-1">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Selected Model */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>ResNet50 v1.0.4</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120"
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-white leading-tight">Dr. Nishant</div>
              <div className="text-[10px] text-slate-400">Chief Radiologist</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </div>
        </div>
      </div>
    </header>
  );
}

