# generator/core.py

from faker import Faker
import random
from typing import Dict, Any, List

# Initialize Faker instance globally (or pass it around)
# You can set a locale if you need region-specific data (e.g., 'en_US')
fake = Faker()

# Define the number of elements for a default array size
DEFAULT_ARRAY_SIZE = (1, 5)

def generate_mock_data(schema: Dict[str, Any], count: int = 1) -> List[Dict[str, Any]]:
    """
    Generates a list of mock data records based on the input schema.
    
    :param schema: The dictionary defining the field names and their types/constraints.
    :param count: The number of records to generate.
    :return: A list of generated data dictionaries.
    """
    data_records = []
    for _ in range(count):
        record = _generate_single_record(schema)
        data_records.append(record)
    return data_records