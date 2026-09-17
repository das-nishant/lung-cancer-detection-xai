import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Eye, Sliders, Sparkles, ZoomIn, ZoomOut, RotateCcw, Crosshair, Cpu, 
  Clock, Sun, Maximize2, CheckCircle2, AlertTriangle, AlertOctagon, Info,
  ChevronUp, ChevronDown 
} from 'lucide-react';

import { API_BASE } from '../config';

export default function RightContent({ result, onOpenFullscreen }) {
  const [viewMode, setViewMode] = useState('slider'); // 'slider', 'sideBySide', 'heatmap'
  const [sliderPos, setSliderPos] = useState(50);
  const [opacity, setOpacity] = useState(0.85);
  const [zoom, setZoom] = useState(1);
  const [isInverted, setIsInverted] = useState(false);

  const [isCardMinimized, setIsCardMinimized] = useState(false);

  // ELEGANT EMPTY STATE
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-12 flex flex-col items-center justify-center min-h-[560px] text-center relative overflow-hidden dicom-grid border border-slate-800"
      >
        {/* Animated Scanning Laser Sweep */}
        <div className="animate-scan-laser"></div>

        {/* Faint CT Scan Radar Silhouette */}
        <div className="w-52 h-52 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center mb-6 relative shadow-2xl">
          <div className="w-40 h-40 rounded-full border border-dashed border-cyan-500/20 flex items-center justify-center animate-spin" style={{ animationDuration: '24s' }}>
            <div className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <Eye className="w-10 h-10 text-cyan-400/80 animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-black text-white tracking-tight">CT Image Viewer & Grad-CAM Standby</h3>
        <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
          Upload a CT scan or click <strong className="text-cyan-300">Load Sample</strong> on the left, then click <strong className="text-cyan-300">Analyze CT Scan</strong> to render heatmaps and prediction overlays.
        </p>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> ResNet50 Engine Ready
          </span>
        </div>
      </motion.div>
    );
  }

  const originalUrl = `${API_BASE}${result.original}`;
  const overlayUrl = `${API_BASE}${result.overlay}`;
  const heatmapUrl = `${API_BASE}${result.heatmap}`;


  const getRiskDetails = (pred) => {
    switch (pred) {
      case 'Normal':
        return { label: 'Low Risk', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> };
      case 'Benign':
        return { label: 'Moderate Risk', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> };
      case 'Malignant':
        return { label: 'High Risk (Critical)', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> };
      default:
        return { label: 'Analyzed', color: 'text-slate-300 bg-slate-800 border-slate-700', icon: <Info className="w-3.5 h-3.5" /> };
    }
  };

  const risk = getRiskDetails(result.prediction);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card relative overflow-hidden border border-slate-800"
    >
      {/* Viewport Top Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">CT Image Viewer & Grad-CAM Overlay</h2>
            <p className="text-[11px] text-slate-400">{result.filename} • ResNet50 Layer4</p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'slider'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Split Slider
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'heatmap'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pure Heatmap
          </button>
        </div>
      </div>

      {/* DICOM Interactive Controls Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
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
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Invert CT Scan (Light / Bone Window)"
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
          <button
            onClick={() => onOpenFullscreen(result)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 transition-colors border border-slate-800"
            title="Fullscreen DICOM Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          {isInverted && <span className="text-cyan-400 font-bold">Light Film</span>}
          <span>Matrix: 224x224</span>
        </div>
      </div>

      {/* Large Canvas Viewport Frame */}
      <div className={`relative w-full h-[480px] rounded-2xl overflow-hidden ${isInverted ? 'bg-slate-950' : 'bg-black'} border border-slate-800 shadow-2xl flex items-center justify-center dicom-grid transition-colors duration-300`}>
        
        {/* FLOATING PREDICTION CARD (Top Right Overlay - Exact Wireframe Spec) */}
        <div className="absolute top-4 right-4 z-30 bg-slate-950/95 backdrop-blur-2xl p-3.5 rounded-2xl border border-cyan-500/30 shadow-2xl w-60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              Prediction Card
            </span>
            <button
              onClick={() => setIsCardMinimized(!isCardMinimized)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
              title={isCardMinimized ? "Expand Card" : "Minimize Card"}
            >
              {isCardMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isCardMinimized ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-black text-white">{result.prediction}</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{result.confidence}%</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Risk Level</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1 ${risk.color}`}>
                    {risk.icon} {risk.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Inference Time</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 0.42 s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Model</span>
                  <span className="font-bold text-slate-200">ResNet50</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="font-bold text-white">{result.prediction}</span>
              <span className="font-mono font-bold text-cyan-400">{result.confidence}%</span>
            </div>
          )}
        </div>

        {/* Mode 1: Split Slider */}
        {viewMode === 'slider' && (
          <div
            className="relative w-full h-full select-none overflow-hidden flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Base Layer: Grad-CAM Overlay (Preserving True JET Heatmap Colors) */}
            {isInverted ? (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                <img
                  src={originalUrl}
                  alt="CT Inverted Base"
                  className="w-full h-full object-contain pointer-events-none"
                  style={{ filter: 'invert(1)' }}
                />
                <img
                  src={heatmapUrl}
                  alt="True Heatmap"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ opacity: opacity, mixBlendMode: 'multiply' }}
                />
              </div>
            ) : (
              <img
                src={overlayUrl}
                alt="Grad-CAM Overlay"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ opacity: opacity }}
              />
            )}

            {/* Top Layer: Original CT Scan clipped via CSS clip-path */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={originalUrl}
                alt="Original CT Scan"
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: isInverted ? 'invert(1)' : 'none' }}
              />
            </div>

            {/* Cyan Vertical Splitter Line */}
            <div
              className="absolute inset-y-0 w-0.5 bg-cyan-400 cursor-ew-resize shadow-[0_0_15px_#06b6d4] flex items-center justify-center z-10 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-lg border-2 border-slate-950">
                ↔
              </div>
            </div>

            {/* Interactive Drag Range Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        )}

        {/* Mode 2: Side-by-Side Dual View */}
        {viewMode === 'sideBySide' && (
          <div className="grid grid-cols-2 gap-2 w-full h-full p-2" style={{ transform: `scale(${zoom})` }}>
            <div className="relative h-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <img
                src={originalUrl}
                alt="Original CT"
                className="max-h-full max-w-full object-contain"
                style={{ filter: isInverted ? 'invert(1)' : 'none' }}
              />
            </div>
            <div className="relative h-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              {isInverted ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={originalUrl}
                    alt="Original CT"
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: 'invert(1)' }}
                  />
                  <img
                    src={heatmapUrl}
                    alt="True Heatmap"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ opacity: opacity, mixBlendMode: 'multiply' }}
                  />
                </div>
              ) : (
                <img src={overlayUrl} alt="Grad-CAM Overlay" className="max-h-full max-w-full object-contain" />
              )}
            </div>
          </div>
        )}

        {/* Mode 3: Pure Heatmap */}
        {viewMode === 'heatmap' && (
          <div className="relative w-full h-full flex items-center justify-center p-2" style={{ transform: `scale(${zoom})` }}>
            <img src={heatmapUrl} alt="Pure JET Heatmap" className="max-h-full max-w-full object-contain rounded-xl" />
          </div>
        )}
      </div>

      {/* Legend Bar & Opacity Slider */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Opacity Control Slider */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Heatmap Transparency
          </span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="font-mono font-bold text-xs text-cyan-300 shrink-0">{Math.round(opacity * 100)}%</span>
        </div>

        {/* JET Colormap Legend Bar */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>0.0 Low (Normal)</span>
            <span className="text-amber-400 font-bold">0.5 Moderate</span>
            <span className="text-rose-400 font-bold">1.0 Peak Suspicion</span>
          </div>
          <div className="w-full h-2 rounded-full jet-colormap-bar shadow-inner border border-slate-800"></div>
        </div>
      </div>
    </motion.div>
  );
}
