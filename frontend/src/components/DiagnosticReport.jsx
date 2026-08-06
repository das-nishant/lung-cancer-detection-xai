import React from 'react';
import { FileText, Printer, CheckCircle, AlertTriangle, AlertOctagon, TrendingUp, ShieldAlert, HeartPulse, UserCheck, Calendar } from 'lucide-react';

export default function DiagnosticReport({ result }) {
  if (!result) return null;

  const { prediction, confidence, probabilities = {}, clinical_notes, filename } = result;

  const getBadgeStyle = () => {
    switch (prediction) {
      case 'Normal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />,
          label: 'NORMAL LUNG PATTERN',
          sub: 'No focal opacity detected'
        };
      case 'Benign':
        return {
          bg: 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/10',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />,
          label: 'BENIGN PULMONARY NODULE',
          sub: 'Smooth well-demarcated nodule'
        };
      case 'Malignant':
        return {
          bg: 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-xl shadow-rose-500/15',
          icon: <AlertOctagon className="w-8 h-8 text-rose-400 shrink-0" />,
          label: 'MALIGNANT LESION SUSPECTED',
          sub: 'Spiculated high-density mass'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300',
          icon: <HeartPulse className="w-8 h-8 shrink-0" />,
          label: prediction,
          sub: 'Analysis completed'
        };
    }
  };

  const badge = getBadgeStyle();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card p-6 md:p-8 mt-8 border border-slate-800">
      {/* Report Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Clinical Diagnostic Summary Report</h2>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Scan File: <strong className="font-mono text-cyan-300">{filename}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500" /> {new Date().toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Print / PDF Export Button */}
        <button
          onClick={handlePrint}
          className="no-print px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-md"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          Export Clinical PDF Report
        </button>
      </div>

      {/* Main Diagnostic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* Classification Badge Card */}
        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${badge.bg}`}>
          {badge.icon}
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80 block">AI Classification Result</span>
            <h3 className="text-lg font-black tracking-tight mt-0.5">{badge.label}</h3>
            <span className="text-xs font-medium opacity-90 block mt-0.5">{badge.sub}</span>
          </div>
        </div>

        {/* Confidence Gauge Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">AI Confidence Score</span>
            <div className="text-3xl font-black text-white mt-1 font-mono tracking-tight">{confidence}%</div>
            <span className="text-[11px] text-slate-500 font-medium">Calibrated ResNet-50 Logits</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex flex-col items-center justify-center font-bold text-xs border border-cyan-500/20 shadow-inner">
            <span className="text-[10px] text-cyan-500 uppercase font-extrabold">Model</span>
            <span className="font-mono font-black text-white">ResNet</span>
          </div>
        </div>

        {/* Clinical Verification Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Explainability Standard</span>
            <div className="text-base font-bold text-slate-200 mt-1">Grad-CAM Visual Heatmap</div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <UserCheck className="w-3.5 h-3.5" /> Radiologist Decision Support
            </span>
          </div>
          <ShieldAlert className="w-10 h-10 text-cyan-400 opacity-60 shrink-0" />
        </div>
      </div>

      {/* Probability Distribution Chart */}
      <div className="mb-6 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80">
        <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Multiclass Probability Distribution
        </h4>

        <div className="space-y-4">
          {Object.entries(probabilities).map(([cls, pct]) => {
            let barColor = 'bg-slate-600';
            let textColor = 'text-slate-300';
            if (cls === 'Normal') { barColor = 'bg-gradient-to-r from-emerald-500 to-teal-400'; textColor = 'text-emerald-400'; }
            if (cls === 'Benign') { barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400'; textColor = 'text-amber-400'; }
            if (cls === 'Malignant') { barColor = 'bg-gradient-to-r from-rose-600 to-pink-500'; textColor = 'text-rose-400'; }

            return (
              <div key={cls}>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-200">{cls}</span>
                  <span className={`font-mono ${textColor}`}>{pct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 shadow-sm ${barColor}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radiologist Decision Support Box */}
      <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest mb-2.5 flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Automated Radiologist Diagnostic Impression Notes
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {clinical_notes}
        </p>
        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 mt-4 pt-3 border-t border-cyan-950/60">
          <span>PulmoXAI Clinical Engine • Decision-Support Tool Only</span>
          <span>Requires review by certified diagnostic radiologist</span>
        </div>
      </div>
    </div>
  );
}
