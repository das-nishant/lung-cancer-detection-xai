import React from 'react';
import { motion } from 'motion/react';
import { FileText, TrendingUp, Printer, CheckCircle2, AlertTriangle, AlertOctagon, Info, ShieldAlert } from 'lucide-react';


export default function BottomAnalyticsPanel({ result }) {
  const handlePrint = () => {
    window.print();
  };

  const probabilities = result?.probabilities || { Normal: 0, Benign: 0, Malignant: 0 };
  const clinicalNotes = result?.clinical_notes || "STANDBY MODE: Please upload a CT scan or select a sample scan from the left sidebar and click 'Analyze CT Scan' to trigger ResNet50 inference and Grad-CAM visual explainability generation.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
    >
      {/* LEFT HALF (50%): PROBABILITY CHART */}
      <div className="glass-card border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">Probability Chart</h3>
                <p className="text-xs text-slate-400">Multiclass confidence distribution scores</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2.5 py-1 rounded-md">
              ResNet50 Logits
            </span>
          </div>

          {/* Probability Distribution Progress Bars */}
          <div className="space-y-4">
            {Object.entries(probabilities).map(([cls, pct]) => {
              let barColor = 'bg-slate-700';
              let textColor = 'text-slate-400';
              if (result) {
                if (cls === 'Normal') { barColor = 'bg-gradient-to-r from-emerald-500 to-teal-400'; textColor = 'text-emerald-400'; }
                if (cls === 'Benign') { barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400'; textColor = 'text-amber-400'; }
                if (cls === 'Malignant') { barColor = 'bg-gradient-to-r from-rose-600 to-pink-500'; textColor = 'text-rose-400'; }
              }

              return (
                <div key={cls} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-200">{cls}</span>
                    <span className={`font-mono text-sm font-extrabold ${textColor}`}>{pct}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
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

        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Target Softmax Normalized</span>
          <span className={result ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
            {result ? "Classification Validated" : "Standby Mode"}
          </span>
        </div>
      </div>

      {/* RIGHT HALF (50%): AI EXPLANATION & RECOMMENDATION */}
      <div className="glass-card border border-slate-800 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">AI Explanation & Recommendation</h3>
                <p className="text-xs text-slate-400">Radiologist decision support summary</p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              disabled={!result}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" /> Export PDF
            </button>
          </div>

          {/* Clinical Impression Note Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <p className="text-xs text-slate-200 font-mono leading-relaxed">
              {clinicalNotes}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>PulmoXAI Clinical Engine • Decision-Support Tool</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldAlert className="w-3 h-3 text-cyan-400" /> Subject to Radiologist Verification
          </span>
        </div>
      </div>
    </motion.div>
  );
}

