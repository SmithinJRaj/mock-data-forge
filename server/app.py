import os
import json
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
from sqlalchemy import create_engine, MetaData, Table, insert
from concurrent.futures import ThreadPoolExecutor
from itertools import islice
# Import the core generator function from Phase 1
from generator.core import generate_mock_data 

app = Flask(__name__)
# Allow cross-origin requests from the React frontend (usually runs on port 3000)
CORS(app) 

def chunked_iterable(iterable,size):
    it = iter(iterable)
    while True:
        chunk = list(islice(it, size))
        if not chunk:
            break
        yield chunk

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
            
        print(f"Received request to stream {count} records.")

        def generate_json_stream():
            yield '[\n'

            # Call the core generator function
            data_generator = generate_mock_data(schema, count)

            for i,record in enumerate(data_generator):
                yield json.dumps(record)
                if i < count - 1:
                    yield ',\n'
                else:
                    yield '\n'
            yield ']\n'
        return Response(generate_json_stream(), mimetype='application/json')
        
    except Exception as e:
        # Catch any unexpected errors from the generator
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

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

        # 1. Generate the data
        generated_records = generate_mock_data(schema, count)

        if not target_url:
            return jsonify({"error": "Target API URL is required"}), 400

        # 2. Forward to external API
        results = {"success": 0, "failed": 0, "errors": []}
        
        def send_single_request(record):
            try:
                response = requests.request(method, target_url, json=record, timeout=10)
                if response.status_code in [200, 201]:
                    return True, None
                else:
                    return False, f"Status {response.status_code}: {response.text}"
            except Exception as e:
                return False, str(e)

        with ThreadPoolExecutor(max_workers=50) as executor:
            for is_success, error_msg in executor.map(send_single_request, generated_records):
                if is_success:
                    results["success"] += 1
                else:
                    results["failed"] += 1

                    if len(results["errors"]) < 100:
                        results["errors"].append(error_msg)

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

        engine = create_engine(db_url)
        metadata = MetaData()
        
        # Reflect the existing table from the DB
        table = Table(table_name, metadata, autoload_with=engine)

        for col_name, col_def in table.columns.items():
            if col_name in schema:
                user_type = schema[col_name].get('type','').lower()
                db_type = str(col_def.type).upper()

                if 'INT' in db_type and user_type not in ['integer','boolean']:
                    return jsonify({
                        "error": "Schema Mismatch",
                        "details": f"Table '{table_name}' expects column '{col_name} to be an INTEGER, but you are trying to generate '{user_type}' data."
                    }),400

                if 'BOOL' in db_type and user_type != 'boolean':
                    return jsonify({
                        "error": "Schema Mismatch",
                        "details": f"Table '{table_name}' expects column '{col_name} to be an BOOLEAN, but you are trying to generate '{user_type}' data."
                    }),400
                
        # 1. Generate the data
        generated_records = generate_mock_data(schema, count)
        
        inserted_count = 0
        BATCH_SIZE = 10000

        with engine.begin() as connection:
            for batch in chunked_iterable(generated_records, BATCH_SIZE):
                connection.execute(insert(table), batch)
                inserted_count += len(batch)
                print(f"Inserted {inserted_count} / {count} records...")

        return jsonify({
            "message": f"Successfully batch-inserted {inserted_count} records into {table_name}",
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({"error": "Database error","details": str(e)}), 500

if __name__ == '__main__':
    # You can configure the port here or use a .env file
    port = int(os.environ.get("PORT", 5000))
    print(f"Flask app running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)