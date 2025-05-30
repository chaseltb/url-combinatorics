FROM python:3.11-slim

# System deps for Tesseract and Pillow
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    poppler-utils \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY uvicorn_start.sh .

# Entrypoint
EXPOSE 8000
CMD ["sh", "uvicorn_start.sh"]
