# Use official slim Python image
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies needed for OpenCV, build-essential, and GLib
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Pre-download and cache all AI models (YOLOv8, ReID, and InsightFace buffalo_l)
# Running the test script triggers InsightFace to download its models to the home directory
RUN python download_models.py && \
    PYTHONPATH=. python tests/test_ai_pipeline.py

# Start FastAPI application directly using Python, letting main.py dynamically bind to $PORT
CMD ["python", "main.py"]
