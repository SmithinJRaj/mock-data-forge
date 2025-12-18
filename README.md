🔨 The Mock Data Forge
The Mock Data Forge is a full-stack developer tool designed to solve the "cold start" problem in software development. It allows developers and testers to generate realistic, high-fidelity mock data using a simple JSON schema.

Whether you need a quick JSON file via the CLI, a visual playground via the Web GUI, or automated data injection into a PostgreSQL database, the Forge has you covered.

🚀 Features
1. Core Generation (MVP)
Primitive Types: string, integer, float, boolean.

Semantic Types: name, email, phone, date, uuid.

File Types: image_url, file_url.

Complex Types: Full support for nested objects and arrays.

2. Advanced Logic & Constraints
Range: Enforce min and max values for numbers.

Choice/Enum: Provide a list of specific values to pick from.

Regex: Generate strings that match a specific pattern (e.g., EMP-[A-Z]{3}-[0-9]{4}).

3. Web Interface (GUI)
Interactive React-based UI to build schemas without writing JSON.

Real-time JSON preview.

One-click generation and download.

4. Automated Entry Support
API Forwarding: Automatically POST generated records to any REST API endpoint.

Database Insertion: Direct injection into SQL databases (Postgres, MySQL, SQLite) via connection strings.

🛠️ Tech Stack
Backend: Python 3.10, Flask, Faker, SQLAlchemy, rstr.

Frontend: React, Vite, Tailwind CSS.

DevOps: Docker, Docker Compose.

🏃 How to Run
Option 1: Docker (Recommended)
This starts both the React frontend (Port 3000) and the Flask backend (Port 5000) simultaneously.

Bash

docker-compose up --build
Option 2: CLI Tool (Local Python)
If you only need to use the script to generate a file:

Bash

# 1. Install dependencies
pip install -r server/requirements.txt

# 2. Run the CLI
python cli.py --input schema.json --output data.json --count 50
Option 3: Manual Development
Backend:

Bash

cd server
python app.py
Frontend:

Bash

cd client
npm install
npm run dev
📄 Example Schema Input
JSON

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
🌐 Deployment
Frontend: Hosted on Vercel/Netlify.

Backend: Hosted on Render/Railway.

Docker Image: Available on Docker Hub (if applicable).

✨ Bonus Points Implemented
[x] Full support for Recursive Objects and Arrays.

[x] Advanced Regex and Enum constraints.

[x] Automated Database and API insertion.

[x] Full Dockerization with docker-compose.

[x] Responsive Web GUI.