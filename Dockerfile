# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory to /app
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application
COPY backend ./

# Expose port
EXPOSE 8000

# Start the FastAPI application
# Railway provides PORT environment variable
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
