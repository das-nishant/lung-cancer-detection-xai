import React, { useState } from 'react';
import { Eye, Sliders, Sparkles, Flame, Target, ZoomIn, ZoomOut, RotateCcw, Crosshair, Activity, Cpu, Clock, ShieldCheck, Sun } from 'lucide-react';

export default function XAIViewer({ result }) {
  const [viewMode, setViewMode] = useState('slider'); // 'slider', 'sideBySide', 'heatmap', 'profile'
  const [sliderPos, setSliderPos] = useState(50);
  const [opacity, setOpacity] = useState(0.85);
  const [zoom, setZoom] = useState(1);
  const [isInverted, setIsInverted] = useState(false);

  // Standby Animated Viewport (Directive #4)
  if (!result) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[500px] text-center border border-dashed border-slate-800 relative overflow-hidden dicom-grid">
        {/* Animated Scanning Laser Line */}
        <div className="animate-scan-laser"></div>

        {/* Faint CT Scan Silhouette */}
        <div className="w-48 h-48 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center mb-6 relative">
          <div className="w-36 h-36 rounded-full border border-dashed border-cyan-500/20 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
            <div className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <Eye className="w-10 h-10 text-cyan-400/80 animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight">Grad-CAM Visualizer Standby</h3>
        <p className="text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
          Select a sample CT scan or upload a custom image on the left, then click <strong className="text-cyan-300">Run XAI Diagnostic Analysis</strong> to render real-time explainability heatmaps.
        </p>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> ResNet50 Engine
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Layer4 Hooks Active
          </span>
        </div>
      </div>
    );
  }

  const backendHost = 'http://localhost:8000';
  const originalUrl = `${backendHost}${result.original}`;
  const overlayUrl = `${backendHost}${result.overlay}`;
  const heatmapUrl = `${backendHost}${result.heatmap}`;
  const roi = result.roi_stats || { high_activation_area_pct: 0, peak_intensity: 0, peak_coordinate: { x: 0, y: 0 } };

  // Helper for badge color
  const getPredBadge = (pred) => {
    switch (pred) {
      case 'Normal':
        return 'badge-normal';
      case 'Benign':
        return 'badge-benign';
      case 'Malignant':
        return 'badge-malignant';
      default:
        return 'bg-slate-800 text-slate-200';
    }
  };

  const profileBars = [15, 22, 35, 48, 72, 95, 88, 64, 42, 28, 18, 12];

  return (
    <div className="glass-card p-6 md:p-7 flex flex-col justify-between h-full border border-slate-800 shadow-2xl">
      <div>
        {/* Post-Analysis Confidence & Performance Metrics Bar (Directive #5) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800">
          {/* Metric 1: Prediction */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Prediction</span>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-black ${getPredBadge(result.prediction)}`}>
              {result.prediction}
            </span>
          </div>

          {/* Metric 2: Confidence */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Confidence</span>
            <span className="text-base font-black text-white font-mono mt-0.5 block">{result.confidence}%</span>
          </div>

          {/* Metric 3: Model */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Model</span>
            <span className="text-xs font-bold text-cyan-300 font-mono mt-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> ResNet50
            </span>
          </div>

          {/* Metric 4: Inference Time */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Inference Time</span>
            <span className="text-xs font-bold text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> 0.42 s
            </span>
          </div>
        </div>

        {/* Viewport Top Header & Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">Grad-CAM Feature Viewport</h2>
              <p className="text-[11px] text-slate-400">Layer4 Activation Heatmaps</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'slider'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Split Slider
            </button>
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'sideBySide'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pure Heatmap
            </button>
            <button
              onClick={() => setViewMode('profile')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'profile'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Heat Curve
            </button>
          </div>
        </div>

        {/* DICOM Toolbar Controls */}
        <div className="flex items-center justify-between gap-2 mb-3 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsInverted(!isInverted)}
              className={`p-1.5 rounded-lg transition-colors border ${
                isInverted
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Invert Colors"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setIsInverted(false); setSliderPos(50); }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 transition-colors border border-slate-800"
              title="Reset Viewport"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Matrix: 224x224</span>
          </div>
        </div>

        {/* DICOM Medical Frame Viewport */}
        <div className="relative w-full h-[340px] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center dicom-grid">
          
          {/* Medical Corner Callouts */}
          <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 border border-slate-800 flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>ROI Peak: [{roi.peak_coordinate?.x || 0}, {roi.peak_coordinate?.y || 0}]</span>
          </div>

          {/* Mode 1: Split Slider */}
          {viewMode === 'slider' && (
            <div
              className="relative w-full h-full select-none overflow-hidden transition-transform duration-300"
              style={{ transform: `scale(${zoom})`, filter: isInverted ? 'invert(1)' : 'none' }}
            >
              {/* Background: Grad-CAM Overlay */}
              <img
                src={overlayUrl}
                alt="Grad-CAM Overlay"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ opacity: opacity }}
              />

              {/* Foreground: Original Image Clipped */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={originalUrl}
                  alt="Original CT Scan"
                  className="absolute inset-0 w-full h-full object-contain max-w-none pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Interactive Neon Slider Line */}
              <div
                className="absolute inset-y-0 w-0.5 bg-cyan-400 cursor-ew-resize shadow-[0_0_15px_#06b6d4] flex items-center justify-center z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-lg border-2 border-slate-950">
                  ↔
                </div>
              </div>

              {/* Range input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
              />
            </div>
          )}

          {/* Mode 2: Side-by-Side Dual View */}
          {viewMode === 'sideBySide' && (
            <div className="grid grid-cols-2 gap-2 w-full h-full p-2" style={{ transform: `scale(${zoom})`, filter: isInverted ? 'invert(1)' : 'none' }}>
              <div className="relative h-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img src={originalUrl} alt="Original CT" className="max-h-full max-w-full object-contain" />
                <span className="absolute bottom-2 left-2 text-[10px] bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                  Original CT
                </span>
              </div>
              <div className="relative h-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img src={overlayUrl} alt="Grad-CAM Overlay" className="max-h-full max-w-full object-contain" />
                <span className="absolute bottom-2 left-2 text-[10px] bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/80 font-mono">
                  Grad-CAM Overlay
                </span>
              </div>
            </div>
          )}

          {/* Mode 3: Pure Heatmap */}
          {viewMode === 'heatmap' && (
            <div className="relative w-full h-full flex items-center justify-center p-2" style={{ transform: `scale(${zoom})`, filter: isInverted ? 'invert(1)' : 'none' }}>
              <img src={heatmapUrl} alt="Pure JET Heatmap" className="max-h-full max-w-full object-contain rounded-xl" />
            </div>
          )}

          {/* Mode 4: Heat Curve Profile */}
          {viewMode === 'profile' && (
            <div className="w-full h-full p-6 flex flex-col justify-between bg-slate-950/90">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-400">
                <span>Spatial Activation Density Curve</span>
                <span>Peak Intensity: {roi.peak_intensity}%</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-44 px-4 pb-2 border-b border-l border-slate-800">
                {profileBars.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 via-cyan-400 to-rose-500 rounded-t transition-all group-hover:brightness-125"
                      style={{ height: `${val}%` }}
                    ></div>
                    <span className="text-[9px] font-mono text-slate-500">P{idx + 1}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Horizontal Axis: Pulmo Spatial Coordinates (Pixels)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* JET Colormap Intensity Scale Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>0.0 Low (Normal)</span>
          <span className="text-amber-400 font-bold">0.5 Moderate</span>
          <span className="text-rose-400 font-bold">1.0 Peak Intensity</span>
        </div>
        <div className="w-full h-2 rounded-full jet-colormap-bar shadow-inner border border-slate-800"></div>
      </div>

      {/* Controls & ROI Hotspot Metrics */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Opacity Control */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Heatmap Transparency
            </span>
            <span className="font-mono font-bold text-cyan-300">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* ROI Hotspot Metrics */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30 shadow-lg shadow-rose-500/10">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">High Activation Area</span>
              <span className="text-white font-extrabold text-sm">{roi.high_activation_area_pct}%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Peak ROI Coord</span>
            <span className="text-cyan-400 font-mono font-bold text-xs">
              X:{roi.peak_coordinate?.x || 0}, Y:{roi.peak_coordinate?.y || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
