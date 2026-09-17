import React, { useState } from 'react';
import { Database, Search, RefreshCw, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { API_BASE } from '../config';

export default function PredictionHistory({ history = [], onDelete, onInspect, loading, onRefresh }) {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');


  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === 'All' || item.prediction.toLowerCase() === filter.toLowerCase();
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.prediction.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeClass = (prediction) => {
    switch (prediction) {
      case 'Normal':
        return 'badge-normal';
      case 'Benign':
        return 'badge-benign';
      case 'Malignant':
        return 'badge-malignant';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 border border-slate-800">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Diagnostic Records & Patient History Log</h2>
            <p className="text-xs text-slate-400 mt-0.5">Archived CT scan classification runs and Grad-CAM reports</p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3.5 h-10 w-60 bg-slate-950/90 border border-slate-700/80 hover:border-slate-600 rounded-xl focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder="Search filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 p-0 leading-normal"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {['All', 'Malignant', 'Benign', 'Normal'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === type
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="p-14 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-300">No diagnostic history records found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Run an XAI analysis in the Diagnostic Workspace tab to save records to the database log.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4">CT Scan File</th>
                <th className="py-3.5 px-4">AI Classification</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 text-slate-300">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-semibold text-slate-500">#{row.id}</td>
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={`${API_BASE}${row.original_path}`}
                      alt="Thumbnail"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-black shadow-md"
                    />
                    <span className="truncate max-w-xs">{row.filename}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${getBadgeClass(row.prediction)}`}>
                      {row.prediction}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-white text-sm">{row.confidence}%</td>
                  <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onInspect(row)}
                        className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all font-bold flex items-center gap-1.5 text-xs shadow-sm"
                        title="Re-Inspect in XAI Viewport"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                      <button
                        onClick={() => onDelete(row.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all shadow-sm"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
