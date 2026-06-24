# 🔨 Mock Data Forge

Mock Data Forge is a full-stack, enterprise-grade synthetic data generation platform designed to solve the "cold start" problem in software development. It enables developers to dynamically build, stream, and seed massive datasets directly into databases and external APIs.

Whether you need a quick JSON file from the CLI, a visual schema builder via a Web UI, or automated data pipelining into your backend, Mock Data Forge scales to your workflow.

## 🚀 Enterprise Architecture & Features

### 1. High-Performance Data Engine
* Memory-Safe Streaming: Core generator utilizes Python `yield` generators to create millions of complex JSON records with an O(1) memory footprint, completely eliminating Out-Of-Memory (OOM) crashes.
* Concurrent Webhook Dispatcher: Integrates Python's ThreadPoolExecutor to handle I/O bottlenecks, blasting generated data to external webhooks in parallel via multi-threaded worker pools.
* Pre-Flight Schema Guardrails: Leverages SQLAlchemy metadata reflection to analyze target database tables at runtime, intercepting type mismatches before generation begins to protect database integrity.

### 2. Advanced Logic & Constraints
* Primitive & Semantic Types: Support for strings, integers, floats, booleans, names, emails, UUIDs, and dates.
* Complex Data Structures: Full support for recursively generated nested objects and arrays.
* Regex-Based Generation: Create custom strings matching precise Regex patterns (e.g., EMP-[A-Z]{3}-[0-9]{4}).
* Range & Enums: Enforce min/max numeric boundaries and generate from fixed categorical sets.

### 3. Multi-Interface Accessibility
* Web GUI: An interactive, split-pane React application featuring a dynamic schema builder and real-time JSON previews.
* CLI Engine: A headless command-line interface for lightning-fast local file generation in CI/CD pipelines.

## 🛠️ Tech Stack

Frontend Layer
* React.js (TypeScript)
* Tailwind CSS (v3)
* UIW React JSON View

Backend Engine Layer
* Python 3.11
* Flask & Gunicorn (WSGI)
* SQLAlchemy (Database Reflection)
* Faker & Rstr (Regex Generation)

DevOps & Deployment
* Docker & Docker Compose
* Multi-stage builds (Node.js compilation statically served via Nginx)

## 🏃 Getting Started

### Option 1: Docker (Recommended)
Runs the entire platform using a multi-container network.

git clone https://github.com/yourusername/mock-data-forge.git
cd mock-data-forge
docker-compose up --build

* Frontend: http://localhost:3000
* Backend API: http://localhost:5000

### Option 2: CLI Tool (Headless Execution)
Use this if you only need to stream high-volume datasets directly to your local file system.

# Install dependencies
pip install -r server/requirements.txt

# Stream 500,000 records safely to disk
python cli.py --input schema.json --output massive_data.json --count 500000

## 📄 Example Schema Config

MockForge uses a simple JSON DSL to define complex data relationships:

{
  "user_id": { "type": "uuid" },
  "full_name": { "type": "name" },
  "age": { "type": "integer", "min": 18, "max": 99 },
  "role": { "type": "enum", "choices": ["Admin", "User", "Guest"] },
  "emp_code": { "type": "string", "regex": "ACME-[0-9]{5}" },
  "meta": {
    "type": "object",
    "schema": {
      "last_login": { "type": "date" },
      "tags": { "type": "array", "items": "string", "size": [1, 3] }
    }
  }
}

## 🌐 API Topography

* POST /api/generate - Streams raw generated JSON back to the client natively.
* POST /api/insert-db - Runs pre-flight validations and safely batch-inserts datasets into target SQL databases (SQLite, PostgreSQL, MySQL).
* POST /api/insert-api - Generates and dispatches mock records to an external target HTTP endpoint concurrently.