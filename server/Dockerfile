FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend + generator
COPY generator ./generator
COPY server ./server

ENV PYTHONPATH=/app

EXPOSE 5000

# Run from project root
CMD ["gunicorn", "--workers","4","--bind","0.0.0.0:5000", "server.app:app"]
