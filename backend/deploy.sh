#!/bin/bash
set -e

echo "============================================="
echo "🚀 Starting Google Cloud Run Deployment"
echo "============================================="

echo ""
echo "📦 Step 1: Creating Artifact Registry Repository..."
gcloud artifacts repositories create media-ai-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Repository for Media Intelligence API" || true

echo ""
echo "🏗️ Step 2: Building Container Image in Cloud Build..."
gcloud builds submit . \
  --tag us-central1-docker.pkg.dev/mlsc-30/media-ai-repo/backend-service:latest \
  --timeout 1200s

echo ""
echo "☁️ Step 3: Deploying Container to Google Cloud Run..."
gcloud run deploy media-ai-backend \
  --image us-central1-docker.pkg.dev/mlsc-30/media-ai-repo/backend-service:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDZz0vWiVJHkqeQW5LUAaKOX7sxRTn25a0,NEXT_PUBLIC_FIREBASE_PROJECT_ID=mlsc-30,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mlsc-30.firebasestorage.app,GOOGLE_API_KEY=AIzaSyCxfQHY4CpmNXk133DQUZ7Rwt6MRMkY-r4,JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

echo ""
echo "🎉 Deployment successfully triggered!"
