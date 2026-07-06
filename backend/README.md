# 🚀 Enterprise AI Media Intelligence Platform – Deployment Guide

This directory contains the FastAPI backend server for face recognition and person re-identification (ReID) indexing.

---

## ⚙️ Environment Configuration

Ensure you have a `.env` file in the `backend/` folder containing the following production variables:

```env
# JWT & Security Configuration
JWT_SECRET="your-secure-jwt-secret-key"

# Firebase Client / REST Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDZz..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="1:your-sender-id:web:your-app-id"

# Google Client API Key (matches Firebase Web key or server key)
GOOGLE_API_KEY="AIzaSyCxf..."
```

---

## 🐳 Option 1: Deploy with Docker (Recommended)

Docker is the easiest way to deploy the platform because it packages the Python C++ extensions (like OpenCV and FAISS) and pre-downloads all model weights (InsightFace `buffalo_l`, YOLOv8, and Person ReID) during the build.

### 1. Build the Docker Image
```bash
docker build -t media-ai-backend .
```
*This will run the downloader and pipeline test, caching the weights inside the image (approx 1.2 GB size).*

### 2. Run the Container
```bash
docker run -d -p 8000:8000 --env-file .env --name media-ai-server media-ai-backend
```
*The API will be live on `http://localhost:8000`.*

---

## 🐍 Option 2: Deploy to a Linux VPS (Ubuntu/Debian)

If deploying to a VPS (e.g., DigitalOcean, AWS EC2, Linode) without Docker, follow these steps:

### 1. System Requirements & Packages
Ensure system libraries for OpenCV and Fortran (for FAISS) are installed:
```bash
sudo apt update
sudo apt install -y build-essential python3-dev python3-venv libgl1-mesa-glx libglib2.0-0
```

### 2. Initialize Virtual Environment & Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Pre-Download Model Files
```bash
python download_models.py
python test_ai_pipeline.py
```

### 4. Run with Gunicorn & Uvicorn Workers (Production)
For production concurrency, run the app using Gunicorn with Uvicorn worker classes:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120
```

---

## ☁️ Option 3: Deploy to Serverless Container Hosts (Google Cloud Run / AWS App Runner)

Because the container has all dependencies and models pre-baked, you can deploy it directly to Serverless Container services:

### Google Cloud Run
1. Submit your build to Google Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/your-project-id/media-ai-backend
   ```
2. Deploy to Cloud Run:
   * **RAM**: Allocate at least **4 GB** (preferably **8 GB**) of RAM to accommodate the FAISS indexes and InsightFace model loads.
   * **CPU**: Allocate at least **2 vCPUs** (preferably **4 vCPUs**).
   * Set environment variables from `.env` in the deployment settings.

---

## ⚛️ Frontend Next.js Deployment

Deploy the Next.js portfolio to Vercel (standard) or Netlify:
* Next.js automatically compiles the new `/search`, `/upload`, and `/dashboard` static pages.
* The frontend dynamically resolves your backend API URL based on your browser host (`window.location.hostname`), meaning it works out-of-the-box whether you run locally on `localhost:3000` or host it on a custom domain!
