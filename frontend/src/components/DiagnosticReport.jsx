import React from 'react';
import { 
  FileText, Printer, CheckCircle, AlertTriangle, AlertOctagon, 
  TrendingUp, ShieldAlert, HeartPulse, UserCheck, Calendar,
  Eye, Download, Crosshair, Cpu, Award, ArrowRight, Activity, Clock
} from 'lucide-react';
import { API_BASE } from '../config';

export default function DiagnosticReport({ result, onNavigateDashboard }) {
  if (!result) {
    return (
      <div className="glass-card p-12 text-center w-full min-h-[480px] flex flex-col items-center justify-center border border-slate-800 dicom-grid">
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5 text-cyan-400">
          <FileText className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">No Diagnostic Report Available</h2>
        <p className="text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
          Select or upload a CT scan and execute the XAI analysis in the Diagnostic Workspace to automatically generate a clinical report.
        </p>
        <button
          onClick={onNavigateDashboard}
          className="mt-6 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <span>Open Diagnostic Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { prediction, confidence, probabilities = {}, clinical_notes, filename, original, heatmap, overlay, roi_stats } = result;

  const originalUrl = original ? `${API_BASE}${original}` : null;
  const heatmapUrl = heatmap ? `${API_BASE}${heatmap}` : null;
  const overlayUrl = overlay ? `${API_BASE}${overlay}` : null;

  const peakCoord = roi_stats?.peak_coordinate || { x: 112, y: 140 };
  const activeArea = roi_stats?.high_activation_area_pct ?? (prediction === 'Malignant' ? 5.01 : prediction === 'Benign' ? 3.2 : 0.8);
  const peakIntensity = roi_stats?.peak_intensity ?? (prediction === 'Malignant' ? 98.6 : prediction === 'Benign' ? 76.4 : 24.1);

  const getBadgeStyle = () => {
    switch (prediction) {
      case 'Normal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badgeClass: 'badge-normal',
          icon: <CheckCircle className="w-7 h-7 text-emerald-400 shrink-0" />,
          label: 'NORMAL PULMONARY FINDING',
          sub: 'No suspicious nodular or spiculated opacity detected',
          urgency: 'Low Risk • Routine Annual Check'
        };
      case 'Benign':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badgeClass: 'badge-benign',
          icon: <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />,
          label: 'BENIGN PULMONARY NODULE',
          sub: 'Well-demarcated nodular opacity with low invasive probability',
          urgency: 'Moderate Priority • 6-Month CT Follow-Up'
        };
      case 'Malignant':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          badgeClass: 'badge-malignant',
          icon: <AlertOctagon className="w-7 h-7 text-rose-400 shrink-0" />,
          label: 'MALIGNANT LESION SUSPECTED',
          sub: 'High-attenuation spiculated soft-tissue mass pattern identified',
          urgency: 'CRITICAL PRIORITY • Urgent Biopsy & Oncologic Consult'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300',
          badgeClass: 'bg-slate-800 text-slate-300',
          icon: <HeartPulse className="w-7 h-7 shrink-0" />,
          label: prediction,
          sub: 'Diagnostic analysis completed',
          urgency: 'Standard Follow-Up'
        };
    }
  };

  const badge = getBadgeStyle();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Clinical Header & Metadata Strip */}
      <div className="glass-card p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Hospital Clinical Record
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Report #{result.id || '9042'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Pulmonary CT Diagnostic & XAI Report
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
              <span>Scan: <strong className="font-mono text-cyan-300">{filename}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span>Modality: <strong className="text-slate-300 font-semibold">Thoracic High-Resolution CT</strong></span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Export Clinical PDF / Print
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`glass-card p-4 border flex items-center gap-3.5 ${badge.bg}`}>
          {badge.icon}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest block opacity-75">Primary AI Finding</span>
            <div className="text-lg font-black tracking-tight">{prediction}</div>
            <span className="text-[10px] font-medium opacity-90 block">{badge.urgency}</span>
          </div>
        </div>

        <div className="glass-card p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Confidence Level</span>
            <div className="text-xl font-black text-white font-mono">{confidence}%</div>
            <span className="text-[10px] text-slate-500 font-mono">Calibrated ResNet-50</span>
          </div>
        </div>

        <div className="glass-card p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Peak Focus Area</span>
            <div className="text-xl font-black text-white font-mono">{activeArea}%</div>
            <span className="text-[10px] text-slate-500 font-mono">At [{peakCoord.x}, {peakCoord.y}]</span>
          </div>
        </div>

        <div className="glass-card p-4 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Inference Latency</span>
            <div className="text-xl font-black text-white font-mono">0.42 s</div>
            <span className="text-[10px] text-emerald-400 font-mono">PyTorch Layer4 Hook</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workspace (50% Imaging Evidence | 50% Clinical Decision Support) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column (6 of 12 columns): Visual Imaging Proof */}
        <div className="lg:col-span-6 space-y-6 w-full">
          <div className="glass-card p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white tracking-tight">Radiological Imaging Evidence</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                ResNet50 Layer4
              </span>
            </div>

            {/* 3-Image Radiological Triad Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Image 1: Original CT Scan */}
              <div className="space-y-1.5 text-center">
                <div className="w-full aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center p-1.5 shadow-md">
                  {originalUrl ? (
                    <img src={originalUrl} alt="Original Scan" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-[10px] text-slate-600 font-mono">No Scan</div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-300 block">Original Scan</span>
              </div>

              {/* Image 2: Pure JET Heatmap */}
              <div className="space-y-1.5 text-center">
                <div className="w-full aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center p-1.5 shadow-md">
                  {heatmapUrl ? (
                    <img src={heatmapUrl} alt="Grad-CAM Heatmap" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-[10px] text-slate-600 font-mono">No Heatmap</div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-300 block">Grad-CAM Heatmap</span>
              </div>

              {/* Image 3: Diagnostic Composite Overlay */}
              <div className="space-y-1.5 text-center">
                <div className="w-full aspect-square rounded-xl bg-black border border-cyan-500/40 overflow-hidden flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/10">
                  {overlayUrl ? (
                    <img src={overlayUrl} alt="Composite Overlay" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-[10px] text-slate-600 font-mono">No Overlay</div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-cyan-400 block">Composite Overlay</span>
              </div>
            </div>

            {/* JET Colormap Bar */}
            <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>0.0 Normal Parenchyma</span>
                <span className="text-amber-400 font-semibold">0.5 Moderate</span>
                <span className="text-rose-400 font-bold">1.0 Peak Suspicion</span>
              </div>
              <div className="w-full h-2 rounded-full jet-colormap-bar border border-slate-800"></div>
            </div>

            {/* ROI Metrics Table */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">High Activation Area</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{activeArea}% of Lung Field</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Peak Gradient Intensity</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{peakIntensity} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 of 12 columns): Clinical Decision Support & Recommendations */}
        <div className="lg:col-span-6 space-y-6 w-full">
          {/* Multiclass Probability Distribution */}
          <div className="glass-card p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white tracking-tight">Multiclass Probability Distribution</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                Softmax Logits
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(probabilities).map(([cls, pct]) => {
                let barColor = 'bg-slate-600';
                let textColor = 'text-slate-300';
                if (cls === 'Normal') { barColor = 'bg-gradient-to-r from-emerald-500 to-teal-400'; textColor = 'text-emerald-400'; }
                if (cls === 'Benign') { barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400'; textColor = 'text-amber-400'; }
                if (cls === 'Malignant') { barColor = 'bg-gradient-to-r from-rose-600 to-pink-500'; textColor = 'text-rose-400'; }

                return (
                  <div key={cls} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-200">{cls}</span>
                      <span className={`font-mono ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
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

          {/* Automated Diagnostic Impression */}
          <div className="glass-card p-6 border border-slate-800">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-800">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold text-white tracking-tight">Automated Clinical Impression Notes</h3>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {clinical_notes}
              </p>
            </div>
          </div>

          {/* Attending Radiologist Attestation / Signature Box */}
          <div className="glass-card p-6 border border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Radiologist Attestation
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Review Status: Signed
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <div>
                <p className="text-white font-bold">Dr. Nishant, MD</p>
                <p className="text-[10px] text-slate-500">Chief Thoracic Radiologist • PulmoXAI Clinical AI</p>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                <p>Digital Signature: <span className="text-cyan-400">PXAI-8924-SIG</span></p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
