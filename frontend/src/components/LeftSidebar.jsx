import { useState } from 'react';
import { API_BASE } from '../config';

import { motion } from "motion/react"
import { AlertCircle, ArrowRight, CheckCircle2, Cpu, Play, ShieldCheck, Sparkles, Upload, Zap } from 'lucide-react';

export default function LeftSidebar({ onAnalyze, loading, samples = [], serverError = null }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setError('Unsupported file type. Please upload PNG, JPG, or JPEG format.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 15MB.');
      return;
    }

    setError(null);
    setSelectedSampleId(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSelectSample = (sample) => {
    setError(null);
    setSelectedFile(null);
    setSelectedSampleId(sample.id);
    setPreviewUrl(`${API_BASE}${sample.url}`);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedFile && !selectedSampleId) {
      setError('Please upload a CT scan image or select a sample CT scan.');
      return;
    }
    onAnalyze({ file: selectedFile, sampleId: selectedSampleId });
  };


  const defaultSamples = [
    { id: "normal_sample", name: "Normal Lung Scan (Healthy)", type: "normal", url: "/static/samples/sample_normal.png" },
    { id: "benign_sample", name: "Benign Pulmonary Nodule", type: "benign", url: "/static/samples/sample_benign.png" },
    { id: "malignant_sample", name: "Malignant Lung Lesion (Spiculated)", type: "malignant", url: "/static/samples/sample_malignant.png" }
  ];

  const displaySamples = samples && samples.length > 0 ? samples : defaultSamples;

  const sampleMeta = {
    normal_sample: {
      emoji: '🫁',
      title: 'Healthy',
      subtitle: 'Normal Lung',
      desc: 'Uniform parenchymal attenuation. No focal opacities or mass.',
      badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    },
    benign_sample: {
      emoji: '🟡',
      title: 'Benign',
      subtitle: 'Pulmonary Nodule',
      desc: 'Smooth well-demarcated nodule in upper lobe. Non-invasive.',
      badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
    },
    malignant_sample: {
      emoji: '🔴',
      title: 'Malignant',
      subtitle: 'Lung Lesion',
      desc: 'Spiculated high-density soft tissue mass with irregular margins.',
      badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-400'
    }
  };


  return (
    <aside className="space-y-6">
      {/* CARD 1: Upload CT Scan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            Upload CT Scan
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            DICOM / PNG / JPG
          </span>
        </div>

        <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-900/60 transition-all group overflow-hidden dicom-grid">
          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={previewUrl}
                alt="Selected CT Scan Preview"
                className="max-h-full max-w-full object-contain rounded-lg shadow-xl border border-slate-800 bg-black"
              />
              <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                <Upload className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-extrabold text-white">Change Scan Image</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-200">
                Drag & drop CT scan file here
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Supported formats: PNG, JPG, DICOM (Max 15MB)</p>
            </div>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        {(error || serverError) && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error || serverError}</span>
          </div>
        )}
      </motion.div>

      {/* CARD 2: Quick Sample Cases */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Quick Sample Cases
          </h3>
          <span className="text-[10px] font-semibold text-slate-500">1-Click Test</span>
        </div>

        <div className="space-y-3">
          {displaySamples.map((s) => {

            const isSelected = selectedSampleId === s.id;
            const meta = sampleMeta[s.id] || { emoji: '🔬', title: s.name, subtitle: s.type, desc: '', badgeClass: 'border-slate-800 text-slate-300' };

            return (
              <div
                key={s.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${isSelected
                  ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-black overflow-hidden border border-slate-800 shrink-0">
                    <img
                      src={`${API_BASE}${s.url}`}
                      alt={s.name}
                      className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                    />
                  </div>


                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-white truncate flex items-center gap-1">
                        <span>{meta.emoji}</span> {meta.title} - {meta.subtitle}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{meta.desc}</p>

                    <button
                      type="button"
                      onClick={() => handleSelectSample(s)}
                      className={`mt-2 text-[10px] font-bold px-2.5 py-1 rounded-md border flex items-center gap-1 transition-all ${isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                    >
                      <span>Load Sample</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CARD 3: Model Information */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-card"
      >
        <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Model Information
        </h3>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1.5 border-b border-slate-800/80">
            <span className="text-slate-400">Current Model</span>
            <span className="font-bold text-white">ResNet50</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800/80">
            <span className="text-slate-400">Grad-CAM Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Enabled (Layer4)
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800/80">
            <span className="text-slate-400">Inference Device</span>
            <span className="font-bold text-cyan-300">PyTorch CPU/GPU</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Model Version</span>
            <span className="font-bold text-slate-300">v1.0.4</span>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Large Primary CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading || (!selectedFile && !selectedSampleId)}
        className="w-full btn-cyan-gradient flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            <span>Running Inference...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
            <Play className="w-4 h-4 fill-current text-slate-950" />
            <span>Analyze CT Scan</span>
          </>
        )}
      </motion.button>
    </aside>
  );
}
