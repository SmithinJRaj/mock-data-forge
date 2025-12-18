FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend + generator
COPY server ./server
COPY generator ./generator

# Run from project root
CMD ["python", "-m", "server.app"]
