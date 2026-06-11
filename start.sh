#!/bin/bash
set -e

echo "Starting MeetingMind..."

# Start FastAPI backend in background
cd /app/backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 &

echo "FastAPI started on port 8000"

# Wait for FastAPI to be ready
sleep 3

# Start Nginx in foreground
echo "Starting Nginx on port 7860..."
nginx -g "daemon off;"
