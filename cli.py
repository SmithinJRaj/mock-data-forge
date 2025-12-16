# cli.py

import argparse
import json
import os
import sys

# Ensure the generator module is accessible
# Assuming 'cli.py' is next to the 'generator' folder
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from generator.core import generate_mock_data

def load_schema(file_path: str) -> dict:
    """Loads the JSON schema from a file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Schema file not found at '{file_path}'")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in schema file at '{file_path}'")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred while loading schema: {e}")
        sys.exit(1)

def write_output(file_path: str, data: list):
    """Writes the generated data to a JSON file."""
    try:
        with open(file_path, 'w') as f:
            # Use indent for human readability
            json.dump(data, f, indent=4)
        print(f"\n✅ Success: Generated {len(data)} records to '{file_path}'")
    except Exception as e:
        print(f"Error: Failed to write data to file: {e}")
        sys.exit(1)

def main():
    """Main function to parse arguments and execute the generation."""
    parser = argparse.ArgumentParser(
        description="The Mock Data Forge: Generates synthetic data based on a JSON schema."
    )
    
    # Required arguments
    parser.add_argument(
        '-i', '--input', 
        required=True, 
        help="Path to the input JSON schema file (e.g., schema.json)."
    )
    parser.add_argument(
        '-o', '--output', 
        required=True, 
        help="Path for the output JSON data file (e.g., data.json)."
    )
    
    # Optional arguments
    parser.add_argument(
        '-c', '--count', 
        type=int, 
        default=1, 
        help="The number of records to generate (default: 1)."
    )
    
    args = parser.parse_args()
    
    # Validation
    if args.count <= 0:
        print("Error: Count must be a positive integer.")
        sys.exit(1)

    print(f"⚙️ Starting data generation...")

    # 1. Load Schema
    schema = load_schema(args.input)
    print(f"   -> Schema loaded from: {args.input}")

    # 2. Generate Data
    generated_data = generate_mock_data(schema, args.count)
    
    # 3. Write Output
    write_output(args.output, generated_data)

if __name__ == '__main__':
    main()