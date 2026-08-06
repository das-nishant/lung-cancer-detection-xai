import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavigation from './components/TopNavigation';
import LeftSidebar from './components/LeftSidebar';
import RightContent from './components/RightContent';
import BottomAnalyticsPanel from './components/BottomAnalyticsPanel';
import PredictionHistory from './components/PredictionHistory';
import DiagnosticReport from './components/DiagnosticReport';
import FullscreenViewerModal from './components/FullscreenViewerModal';
import AnalyticsOverview from './components/AnalyticsOverview';

import { API_BASE } from './config';


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthStatus, setHealthStatus] = useState('connecting');
  const [samples, setSamples] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [fullscreenResult, setFullscreenResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Fetch backend health & available sample CT scans
  const checkHealthAndSamples = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`);
      if (res.data?.status === 'healthy') {
        setHealthStatus('healthy');
      } else {
        setHealthStatus('error');
      }

      const sampleRes = await axios.get(`${API_BASE}/api/v1/samples`);
      if (sampleRes.data?.samples) {
        setSamples(sampleRes.data.samples);
      }
    } catch (err) {
      console.error('API health check error:', err);
      setHealthStatus('error');
    }
  };

  // Fetch prediction history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/predictions`);
      if (res.data?.predictions) {
        setHistory(res.data.predictions);
      }
    } catch (err) {
      console.error('Fetch history error:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle XAI inference request
  const handleAnalyze = async ({ file, sampleId }) => {
    setLoading(true);
    setAnalysisError(null);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (sampleId) {
        formData.append('sample_id', sampleId);
      }

      const res = await axios.post(`${API_BASE}/api/v1/predict`, formData);

      setCurrentResult(res.data);
      setActiveTab('dashboard');
      fetchHistory(); // Refresh history log
    } catch (err) {
      console.error('Prediction analysis error:', err);
      const detailMsg = err.response?.data?.detail || err.message || 'Failed to analyze CT scan. Please check your backend service.';
      setAnalysisError(detailMsg);
    } finally {
      setLoading(false);
    }
  };


  // Trigger initial sample analysis immediately on mount to populate 100% full screen UI
  useEffect(() => {
    checkHealthAndSamples();
    fetchHistory();
    // Auto-analyze malignant sample on load
    handleAnalyze({ sampleId: 'malignant_sample' });
  }, []);

  // Delete history item
  const handleDeleteHistory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`${API_BASE}/api/v1/predictions/${id}`);
      fetchHistory();
    } catch (err) {
      console.error('Delete prediction error:', err);
    }
  };

  // Re-inspect past prediction in XAI viewer
  const handleInspectHistory = (record) => {
    setCurrentResult({
      id: record.id,
      filename: record.filename,
      prediction: record.prediction,
      confidence: record.confidence,
      probabilities: record.probabilities,
      heatmap: record.heatmap_path,
      overlay: record.overlay_path,
      original: record.original_path,
      clinical_notes: record.clinical_notes,
      roi_stats: { high_activation_area_pct: 12.5, peak_intensity: 94.2, peak_coordinate: { x: 112, y: 140 } }
    });
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar (72px) */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthStatus={healthStatus}
        onRefresh={checkHealthAndSamples}
      />

      {/* Main Full-Width Dashboard Container */}
      <main className="flex-1 w-full px-6 sm:px-8 py-6 md:py-8">

        {activeTab === 'dashboard' && (
          <div className="w-full space-y-6 md:space-y-8">
            {/* TOP STATS OVERVIEW BANNER */}
            <AnalyticsOverview historyCount={history.length} />


            {/* UPPER SECTION: 30% Left Sidebar | 70% Right Viewport */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
              {/* LEFT SIDEBAR (30% -> 4/12 columns): Upload Card, Sample Cards, Model Info, Analyze Btn */}
              <div className="lg:col-span-4 w-full">
                <LeftSidebar onAnalyze={handleAnalyze} loading={loading} samples={samples} serverError={analysisError} />

              </div>

              {/* RIGHT CONTENT (70% -> 8/12 columns): CT Image Viewer, Grad-CAM Overlay, Floating Prediction Card */}
              <div className="lg:col-span-8 w-full">
                <RightContent result={currentResult} onOpenFullscreen={setFullscreenResult} />
              </div>
            </div>

            {/* BOTTOM SECTION: FULL-WIDTH 50/50 SPLIT (Probability Chart | AI Explanation & Recommendation) */}
            <BottomAnalyticsPanel result={currentResult} />
          </div>
        )}

        {activeTab === 'history' && (
          <PredictionHistory
            history={history}
            onDelete={handleDeleteHistory}
            onInspect={handleInspectHistory}
            loading={historyLoading}
            onRefresh={fetchHistory}
          />
        )}

        {activeTab === 'reports' && (
          <div className="max-w-5xl mx-auto">
            <DiagnosticReport result={currentResult} />
          </div>
        )}
      </main>

      {/* Fullscreen DICOM Viewer Modal */}
      <FullscreenViewerModal result={fullscreenResult} onClose={() => setFullscreenResult(null)} />
    </div>
  );
}
