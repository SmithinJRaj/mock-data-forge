import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from sqlalchemy import create_engine, MetaData, Table, insert

# Import the core generator function from Phase 1
from generator.core import generate_mock_data 

app = Flask(__name__)
# Allow cross-origin requests from the React frontend (usually runs on port 3000)
CORS(app) 

@app.route('/', methods=['GET'])
def home():
    """Simple health check endpoint."""
    return jsonify({"status": "Generator API is running", 
                    "version": "1.0"}), 200

@app.route('/api/generate', methods=['POST'])
def generate_data_endpoint():
    """
    API endpoint to generate mock data.
    
    Expects a JSON body with:
    {
      "schema": {...}, 
      "count": 100
    }
    """
    try:
        data = request.get_json()
        schema = data.get('schema')
        count = data.get('count', 1)
        
        if not schema or not isinstance(schema, dict):
            return jsonify({"error": "Missing or invalid 'schema' in request body."}), 400
        
        if not isinstance(count, int) or count < 1:
            return jsonify({"error": "'count' must be a positive integer."}), 400
            
        print(f"Received request to generate {count} records.")

        # Call the core generator function
        generated_data = generate_mock_data(schema, count)
        
        # Return the generated data as a JSON array
        return jsonify(generated_data), 200
        
    except Exception as e:
        # Catch any unexpected errors from the generator
        print(f"An error occurred during generation: {e}")
        return jsonify({"error": "Internal server error during data generation.", 
                        "details": str(e)}), 500

@app.route('/api/insert-api', methods=['POST'])
def insert_to_api():
    """
    Generates data and sends it to a specified external API.
    """
    try:
        data = request.get_json()
        schema = data.get('schema')
        count = data.get('count', 1)
        target_url = data.get('target_url')
        method = data.get('method', 'POST').upper()

        if not target_url:
            return jsonify({"error": "Target API URL is required"}), 400

        # 1. Generate the data
        generated_records = generate_mock_data(schema, count)
        
        # 2. Forward to external API
        results = {"success": 0, "failed": 0, "errors": []}
        
        for record in generated_records:
            try:
                response = requests.request(method, target_url, json=record)
                if response.status_code in [200, 201]:
                    results["success"] += 1
                else:
                    results["failed"] += 1
                    results["errors"].append(f"Status {response.status_code}: {response.text}")
            except Exception as e:
                results["failed"] += 1
                results["errors"].append(str(e))

        return jsonify({
            "message": "API Insertion process complete",
            "results": results
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/insert-db', methods=['POST'])
def insert_to_db():
    """
    Generates data and inserts it into a SQL database table.
    """
    try:
        data = request.get_json()
        schema = data.get('schema')
        count = data.get('count', 1)
        db_url = data.get('db_url') # e.g., sqlite:///test.db
        table_name = data.get('table_name')

        if not db_url or not table_name:
            return jsonify({"error": "Database URL and Table Name are required"}), 400

        # 1. Generate the data
        generated_records = generate_mock_data(schema, count)

        # 2. Connect to DB and Insert
        engine = create_engine(db_url)
        metadata = MetaData()
        
        # Reflect the existing table from the DB
        table = Table(table_name, metadata, autoload_with=engine)
        
        with engine.begin() as connection:
            connection.execute(insert(table), generated_records)

        return jsonify({
            "message": f"Successfully inserted {count} records into {table_name}",
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({"error": f"Database insertion failed: {str(e)}"}), 500

if __name__ == '__main__':
    # You can configure the port here or use a .env file
    port = int(os.environ.get("PORT", 5000))
    print(f"Flask app running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)