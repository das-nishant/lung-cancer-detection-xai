import React, { useState } from 'react';
import { Upload, FileImage, Sparkles, CheckCircle2, AlertCircle, Play, Zap, FolderPlus } from 'lucide-react';

export default function ImageUploader({ onAnalyze, loading, samples = [] }) {
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
    setPreviewUrl(`http://localhost:8000${sample.url}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !selectedSampleId) {
      setError('Please upload a CT scan image or select a sample CT scan.');
      return;
    }
    onAnalyze({ file: selectedFile, sampleId: selectedSampleId });
  };

  // Preset Card Metadata helper
  const getPresetCardDetails = (type) => {
    switch (type) {
      case 'normal':
        return {
          icon: '🫁',
          title: 'Healthy',
          subtitle: 'Normal Lung',
          badgeClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
          selectedBorder: 'border-emerald-400 ring-2 ring-emerald-400/40'
        };
      case 'benign':
        return {
          icon: '🟡',
          title: 'Benign',
          subtitle: 'Pulmonary Nodule',
          badgeClass: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
          selectedBorder: 'border-amber-400 ring-2 ring-amber-400/40'
        };
      case 'malignant':
        return {
          icon: '🔴',
          title: 'Malignant',
          subtitle: 'Lung Lesion',
          badgeClass: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
          selectedBorder: 'border-rose-400 ring-2 ring-rose-400/40'
        };
      default:
        return {
          icon: '🔬',
          title: 'Sample',
          subtitle: 'CT Scan',
          badgeClass: 'border-slate-700 bg-slate-800 text-slate-300',
          selectedBorder: 'border-cyan-400 ring-2 ring-cyan-400/40'
        };
    }
  };

  return (
    <div className="glass-card p-6 md:p-7 flex flex-col justify-between h-full border border-slate-800 shadow-2xl">
      <div>
        {/* Title Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 border border-cyan-400/40 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Select or Upload CT Scan</h2>
              <p className="text-xs text-slate-400">High-resolution thoracic axial CT slices</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            DICOM / PNG
          </span>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="mb-8">
          <label className="relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl cursor-pointer bg-slate-950/70 hover:bg-slate-900/80 transition-all group overflow-hidden dicom-grid">
            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-3">
                <img
                  src={previewUrl}
                  alt="Selected CT Scan Preview"
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-slate-700 bg-black"
                />
                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-sm">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-extrabold text-white">Change Scan Image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-base font-extrabold text-slate-200">
                  Drag & Drop CT Scan File Here
                </p>
                <p className="text-xs text-slate-400 mt-1.5">Supports PNG, JPG, or DICOM images (Max 15MB)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {/* Sample Scan Mini Cards (Directive #3) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Instant Preset Sample Scans
            </label>
            <span className="text-[11px] font-semibold text-slate-500">Click to Select</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {samples.map((s) => {
              const isSelected = selectedSampleId === s.id;
              const meta = getPresetCardDetails(s.type);

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group ${
                    isSelected
                      ? `bg-slate-900/90 ${meta.selectedBorder} shadow-xl shadow-cyan-500/10`
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{meta.icon}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-slate-500"></span>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-white tracking-tight">{meta.title}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">{meta.subtitle}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${meta.badgeClass}`}>
                      {s.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Prominent Blue -> Cyan CTA Button (Directive #2) */}
      <button
        onClick={handleSubmit}
        disabled={loading || (!selectedFile && !selectedSampleId)}
        className="w-full rounded-2xl flex items-center justify-center gap-3 transition-all btn-cta-prominent disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Running Grad-CAM Inference...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <Play className="w-4 h-4 fill-current text-white" />
            <span>RUN XAI DIAGNOSTIC ANALYSIS</span>
          </>
        )}
      </button>
    </div>
  );
}
