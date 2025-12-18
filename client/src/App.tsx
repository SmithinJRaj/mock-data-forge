import React, { useState } from 'react';
import FieldEditor from './components/FieldEditor';
import OutputDisplay from './components/OutputDisplay';
import './App.css';

type FieldDefinition = {
  type: string;
  min?: number;
  max?: number;
  choices?: string[];
};

type Schema = Record<string, FieldDefinition>;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [schema, setSchema] = useState<Schema>({});
  const [outputData, setOutputData] = useState<any[] | null>(null);
  const [recordCount, setRecordCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addField = () => {
    let index = Object.keys(schema).length + 1;
    let name = `field_${index}`;

    while (schema[name]) {
      index++;
      name = `field_${index}`;
    }

    setSchema(prev => ({
      ...prev,
      [name]: { type: 'string' },
    }));
  };

  const handleSchemaChange = (
    fieldName: string,
    newDefinition: FieldDefinition
  ) => {
    setSchema(prev => ({
      ...prev,
      [fieldName]: newDefinition,
    }));
  };

  const removeField = (fieldName: string) => {
    setSchema(prev => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const generateData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schema,
          count: recordCount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'API error');
      }

      const data = await res.json();
      setOutputData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate data. Check backend logs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Mock Data Forge 🔨</h1>

      <div className="schema-section">
        {Object.entries(schema).map(([name, definition]) => (
          <FieldEditor
            key={name}
            fieldName={name}
            definition={definition}
            onChange={handleSchemaChange}
            onRemove={() => removeField(name)}
          />
        ))}
        <button onClick={addField}>+ Add Attribute</button>
      </div>

      <div className="controls">
        <input
          type="number"
          min={1}
          value={recordCount}
          onChange={e => setRecordCount(Number(e.target.value))}
        />
        <button
          onClick={generateData}
          disabled={isLoading || Object.keys(schema).length === 0}
        >
          {isLoading ? 'Generating…' : '🚀 Generate Data'}
        </button>
      </div>

      <OutputDisplay data={outputData} />
    </div>
  );
}

export default App;
