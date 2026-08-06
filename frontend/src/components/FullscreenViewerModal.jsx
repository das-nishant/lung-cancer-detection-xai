import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { API_BASE } from '../config';

export default function FullscreenViewerModal({ result, onClose }) {

  if (!result) return null;

  const overlayUrl = `${API_BASE}${result.overlay}`;


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white">{result.filename} - High Resolution DICOM View</h2>
            <p className="text-xs text-slate-400 font-mono">Prediction: {result.prediction} ({result.confidence}%)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden dicom-grid">
          <img
            src={overlayUrl}
            alt="Fullscreen Grad-CAM Overlay"
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
          />
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>ResNet50 Layer4 Activation Map</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
}
