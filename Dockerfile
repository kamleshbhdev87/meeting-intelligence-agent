FROM python:3.11-slim

# Install Node.js and nginx
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/ ./backend/

# Build React frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Copy built frontend to nginx html directory
RUN cp -r frontend/dist/* /var/www/html/

# Nginx config — serves React on / and proxies /api to FastAPI
COPY nginx.conf /etc/nginx/sites-available/default

# Startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# HuggingFace Spaces requires port 7860
EXPOSE 7860

CMD ["./start.sh"]
