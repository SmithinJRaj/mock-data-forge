# 🔨 Mock Data Forge

Mock Data Forge is a full-stack developer tool built to solve the “cold start” problem in software development. It enables developers and testers to generate realistic, high-fidelity mock data using a simple yet powerful JSON schema.

Whether you need:

a quick JSON file from the CLI,

a visual schema builder via a Web UI,

or automated insertion into APIs or databases,

Mock Data Forge has you covered.

# 🚀 Features
1. Core Data Generation (MVP)

Primitive Types: string, integer, float, boolean

Semantic Types: name, email, phone, date, uuid

File Types: image_url, file_url

Complex Types: Full support for nested objects and arrays

2. Advanced Logic & Constraints

Range Constraints: min / max for numeric values

Enum / Choice Support: Generate from a fixed set of values

Regex-Based Generation: Create strings matching custom patterns
(e.g. EMP-[A-Z]{3}-[0-9]{4})

3. Web Interface (GUI)

Interactive React-based schema builder

Real-time JSON preview

One-click generation and download

4. Automated Entry Support

API Forwarding: POST generated records directly to any REST API

Database Insertion: Insert data into SQL databases
(PostgreSQL, MySQL, SQLite) using connection strings

# 🛠️ Tech Stack

Backend

Python 3.10

Flask

Faker

SQLAlchemy

rstr

Frontend

React

Vite

Tailwind CSS

DevOps

Docker

Docker Compose

# 🏃 Getting Started
Option 1: Docker (Recommended)

Runs both the frontend and backend together.

docker-compose up --build


Frontend → http://localhost:3000

Backend → http://localhost:5000

Option 2: CLI Tool (Local Python)

Use this if you only need file generation.

# Install dependencies
pip install -r server/requirements.txt

# Run the CLI
python cli.py --input schema.json --output data.json --count 50

Option 3: Manual Development Setup
Backend
cd server
python app.py

Frontend
cd client
npm install
npm run dev

📄 Example Schema
{
  "user_id": "uuid",
  "full_name": "name",
  "age": { "type": "integer", "min": 18, "max": 99 },
  "role": { "type": "enum", "choices": ["Admin", "User", "Guest"] },
  "emp_code": { "type": "string", "regex": "ACME-[0-9]{5}" },
  "meta": {
    "type": "object",
    "schema": {
      "last_login": "date",
      "tags": { "type": "array", "items": "string", "size": [1, 3] }
    }
  }
}

# 🌐 Deployment

Frontend: Vercel / Netlify

Backend: Render / Railway

Docker Image: Docker Hub (optional)

# ✨ Bonus Features Implemented

 Recursive objects and arrays

 Advanced regex-based string generation

 Enum and constraint support

 Automated API and database insertion

 Full Dockerization with docker-compose

 Responsive Web GUI

# 🧠 Philosophy

Mock Data Forge is designed to scale with your workflow:

CLI for speed

GUI for exploration

Automation for real-world testing pipelines