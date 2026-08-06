# 🫁 PulmoXAI: Explainable Deep Learning Lung Cancer Classification System

[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**PulmoXAI** is an advanced, full-stack Explainable AI (XAI) clinical decision-support web application designed to analyze chest CT scan images and classify them into 3 diagnostic categories (**Normal**, **Benign**, and **Malignant**).

By leveraging **Gradient-weighted Class Activation Mapping (Grad-CAM)** on deep ResNet-50 feature maps, PulmoXAI transforms opaque deep learning models into transparent, visually interpretable diagnostic tools for radiologists and medical researchers.

---

## 🎯 Problem & Solution

### The Challenge
- **The "Black Box" Medical AI Problem**: Traditional deep neural networks output diagnosis labels (e.g., *"Malignant: 96%"*) without explaining *where* or *why* the anomaly was detected.
- **Diagnostic Oversight & Workload**: Reviewing multi-slice CT scans for subtle pulmonary nodules or early-stage lesions is labor-intensive and prone to human fatigue.

### The PulmoXAI Solution
- **Visual Interpretability**: Generates Grad-CAM visual heatmaps overlaying thermal Jet colormaps directly onto the chest CT scan to highlight pulmonary lesions, nodules, and soft tissue opacities.
- **Quantitative ROI Metrics**: Computes precise Region of Interest (ROI) metrics including peak activation coordinates $(X, Y)$, high-activation area percentage, and peak intensity.
- **Integrated Diagnostic Suite**: Interactive DICOM viewport with split-slider, side-by-side comparison, pure heatmap mode, historical scan logger, and downloadable clinical diagnostic PDF reports.

---

## ✨ Key Features

- 🔬 **3-Class ResNet-50 Classification**: Fine-tuned PyTorch architecture evaluating CT scans for Normal, Benign Nodule, and Malignant Lesion categories.
- 🔥 **Grad-CAM Visual Heatmaps & Overlays**: Real-time layer activation mapping with background masking to keep non-body areas pure black.
- 🎛️ **Interactive CT Image Viewport**:
  - **Split Slider**: Drag divider with pixel-perfect CSS `clip-path` overlay alignment.
  - **Side-by-Side View**: Dual-pane original vs. Grad-CAM visual comparison.
  - **Pure Heatmap Mode**: High-contrast thermal Jet colormap visualization.
  - **DICOM Controls**: Zoom ($1.0\times - 2.5\times$), color inversion, viewport reset, transparency slider, and fullscreen mode.
- 📊 **Multiclass Confidence Distributions**: Probability progress bars for Normal, Benign, and Malignant confidence scores.
- 📝 **Automated Radiologist Impression Notes**: Context-aware clinical summaries detailing peak activation area and recommended follow-up actions.
- 🗄️ **Diagnostic History Logger**: Persistent record keeping backed by SQLite database context managers.
- 📑 **Exportable Clinical Reports**: Formal printable summaries via `window.print()` optimized for PDF export.

---

## 🛠️ Technology Stack

### **Backend (AI Engine & Microservices)**
- **Framework**: Python 3.11+, [FastAPI](https://fastapi.tiangolo.com/), `uvicorn`
- **Deep Learning / Vision**: `PyTorch`, `torchvision` (ResNet-50 backbone), `OpenCV` (`cv2`), `Pillow`, `NumPy`
- **Explainability Engine**: Custom PyTorch forward/backward hook `GradCAM` implementation with automatic hook deregistration memory cleanup
- **Database**: SQLite3 with thread-safe context managers

### **Frontend (Clinical Web Application)**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Tailwind CSS v4, custom glassmorphism design system (`Inter`, `Outfit`, `JetBrains Mono` Google Fonts)
- **Icons & Motion**: `lucide-react`, `@motion/react` (`framer-motion`), `axios`

### **Infrastructure & Deployment**
- **Containerization**: Docker & Docker Compose (`lung_xai_backend` & `lung_xai_frontend`)

---

## 📁 Project Directory Structure

```
Collage_project/
├── docker-compose.yml           # Docker orchestration for backend & frontend services
├── .gitignore                   # Root gitignore rules
├── README.md                    # System documentation
│
├── backend/                     # FastAPI & PyTorch AI Service
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint, CORS, static mounts & routes
│   │   ├── ai/
│   │   │   └── model.py         # ResNet-50 architecture & radiological texture heuristics
│   │   ├── api/
│   │   │   ├── health.py        # GET /health
│   │   │   ├── predict.py       # POST /api/v1/predict
│   │   │   ├── history.py       # GET & DELETE /api/v1/predictions
│   │   │   └── samples.py       # GET /api/v1/samples
│   │   ├── explainability/
│   │   │   └── gradcam.py       # Grad-CAM engine with memory cleanup & background masking
│   │   ├── preprocessing/
│   │   │   └── image.py         # PIL image decoding & ImageNet normalization
│   │   ├── database/
│   │   │   └── db.py            # SQLite database schema & transaction managers
│   │   └── services/
│   │       └── sample_generator.py # Synthetic axial CT scan generator
│   └── uploads/                 # Static uploads (original, heatmaps, overlays, samples)
│
└── frontend/                    # React 19 + Vite Web Application
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx             # React DOM root
        ├── App.jsx              # Core layout, tab navigation & state coordinator
        ├── config.js            # Central API_BASE URL configuration
        ├── index.css            # Design tokens, glassmorphism & Tailwind CSS rules
        └── components/
            ├── TopNavigation.jsx        # Sticky top header & status indicators
            ├── AnalyticsOverview.jsx    # Top 4-stat clinical overview cards
            ├── LeftSidebar.jsx          # Drag & drop uploader & sample case selector
            ├── RightContent.jsx         # Interactive CT Viewport & Grad-CAM visualizer
            ├── BottomAnalyticsPanel.jsx # Multiclass probability chart & radiologist notes
            ├── PredictionHistory.jsx    # Filterable diagnostic records log
            ├── DiagnosticReport.jsx     # Printable clinical diagnostic report card
            └── FullscreenViewerModal.jsx# Fullscreen high-res DICOM viewer modal
```

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

1. Clone the repository and navigate to the root directory:
   ```bash
   git clone https://github.com/your-repo/pulmo-xai.git
   cd pulmo-xai
   ```

2. Launch backend and frontend containers:
   ```bash
   docker-compose up --build
   ```

3. Access the web dashboard:
   - **Frontend UI**: `http://localhost:5173`
   - **Backend API**: `http://localhost:8000`
   - **API Docs (Swagger)**: `http://localhost:8000/docs`

---

### Option 2: Run Manually (Local Development)

#### 1. Start Backend Service
```bash
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Start Frontend Development Server
```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health status, Python/PyTorch versions & device info |
| `POST` | `/api/v1/predict` | Upload CT scan (`file`) or select preset (`sample_id`) for XAI analysis |
| `GET` | `/api/v1/predictions` | Fetch all historical diagnostic scan runs |
| `DELETE` | `/api/v1/predictions/{id}` | Delete a diagnostic record by ID |
| `GET` | `/api/v1/samples` | List available benchmark sample CT scans |

---

## 🔬 Clinical Disclaimer

> [!IMPORTANT]
> **PulmoXAI** is designed exclusively as an **educational and diagnostic decision-support tool**. It is intended to assist medical professionals by providing visual interpretability into deep learning predictions. It does **not** replace professional clinical judgment or biopsy confirmation by a licensed diagnostic radiologist.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
