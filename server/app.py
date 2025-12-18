import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

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

if __name__ == '__main__':
    # You can configure the port here or use a .env file
    port = int(os.environ.get("PORT", 5000))
    print(f"Flask app running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)