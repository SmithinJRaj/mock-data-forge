import React, { useState } from 'react';
import FieldEditor from './components/FieldEditor';
import OutputDisplay from './components/OutputDisplay';
import { FiPlus, FiPlay, FiDatabase, FiGlobe, FiX } from 'react-icons/fi';

type UIField = {
  id: string;
  name: string;
  type: string;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [fields, setFields] = useState<UIField[]>([
    { id: '1', name: 'id', type: 'uuid' },
    { id: '2', name: 'full_name', type: 'name' },
  ]);
  const [outputData, setOutputData] = useState<any[] | null>(null);
  const [recordCount, setRecordCount] = useState<number>(10);
  
  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Modal States
  const [showDbModal, setShowDbModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [dbConfig, setDbConfig] = useState({ url: 'sqlite:///test.db', table: 'users' });
  const [apiConfig, setApiConfig] = useState({ url: 'https://jsonplaceholder.typicode.com/posts', method: 'POST' });

  // --- Schema Management ---
  const addField = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setFields([...fields, { id: newId, name: `new_field_${fields.length + 1}`, type: 'string' }]);
  };

  const updateField = (id: string, updatedField: UIField) => {
    setFields(fields.map(f => f.id === id ? updatedField : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const getApiSchema = () => {
    return fields.reduce((acc, field) => {
      if (field.name.trim() !== '') acc[field.name] = { type: field.type };
      return acc;
    }, {} as Record<string, any>);
  };

  // --- Core API Calls ---
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema: getApiSchema(), count: recordCount }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setOutputData(data);
    } catch (err) {
      alert('Failed to generate preview. Check backend logs.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeDeployment = async (type: 'db' | 'api') => {
    setIsDeploying(true);
    const endpoint = type === 'db' ? '/api/insert-db' : '/api/insert-api';
    const payload = {
      schema: getApiSchema(),
      count: recordCount,
      ...(type === 'db' 
          ? { db_url: dbConfig.url, table_name: dbConfig.table } 
          : { target_url: apiConfig.url, method: apiConfig.method })
    };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Deployment failed');
      
      alert(`Success! \n${JSON.stringify(data.message || data.results, null, 2)}`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsDeploying(false);
      setShowDbModal(false);
      setShowApiModal(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden relative">
      
      {/* LEFT PANE: Schema Builder */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-gray-50 z-10">
        <header className="px-8 py-6 bg-white border-b border-gray-200 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            {/* @ts-ignore */}
            <FiDatabase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MockForge</h1>
            <p className="text-sm text-gray-500">Synthetic Data Generation Engine</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Schema Definition</h2>
            <button 
              onClick={addField}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
            >
              {/* @ts-ignore */}
              <FiPlus /> Add Field
            </button>
          </div>

          <div className="space-y-3">
            {fields.map(field => (
              <FieldEditor key={field.id} id={field.id} field={field} onChange={updateField} onRemove={removeField} />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Controls & Output */}
      <div className="w-1/2 flex flex-col bg-[#0d1117] text-gray-300 z-10">
        <div className="px-8 py-6 border-b border-gray-800 bg-[#161b22] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Rows to Generate</label>
              <input
                type="number" min={1} max={1000000} value={recordCount}
                onChange={(e) => setRecordCount(Number(e.target.value))}
                className="w-32 bg-[#0d1117] text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* NEW BUTTON: Database Pipeline */}
            <button
              onClick={() => setShowDbModal(true)} disabled={fields.length === 0}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded shadow-lg disabled:opacity-50 transition-all text-sm"
            >
              {/* @ts-ignore */}
              <FiDatabase /> Send to DB
            </button>

            {/* NEW BUTTON: Webhook Pipeline */}
            <button
              onClick={() => setShowApiModal(true)} disabled={fields.length === 0}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded shadow-lg disabled:opacity-50 transition-all text-sm"
            >
              {/* @ts-ignore */}
              <FiGlobe /> Send to API
            </button>

            {/* Generate Preview */}
            <button
              onClick={handleGenerate} disabled={isLoading || fields.length === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-lg disabled:opacity-50 transition-all text-sm ml-2"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 
              /* @ts-ignore */
              <><FiPlay /> Preview</>}
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <OutputDisplay data={outputData} />
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Database Modal */}
      {showDbModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {/* @ts-ignore */}
                <FiDatabase className="text-emerald-600"/> Database Seeder
              </h3>
              <button onClick={() => setShowDbModal(false)} className="text-gray-400 hover:text-gray-600">
                {/* @ts-ignore */}
                <FiX size={20}/>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">SQLAlchemy Connection String</label>
                <input type="text" value={dbConfig.url} onChange={e => setDbConfig({...dbConfig, url: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Table Name</label>
                <input type="text" value={dbConfig.table} onChange={e => setDbConfig({...dbConfig, table: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-900" />
              </div>
              <button onClick={() => executeDeployment('db')} disabled={isDeploying} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors flex justify-center items-center h-10">
                {isDeploying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : `Batch Insert ${recordCount} Rows`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook API Modal */}
      {showApiModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#161b22] border border-gray-700 rounded-xl shadow-2xl p-6 w-96 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                {/* @ts-ignore */}
                <FiGlobe className="text-purple-500"/> API Dispatcher
              </h3>
              <button onClick={() => setShowApiModal(false)} className="text-gray-500 hover:text-gray-300">
                {/* @ts-ignore */}
                <FiX size={20}/>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Target Webhook URL</label>
                <input type="text" value={apiConfig.url} onChange={e => setApiConfig({...apiConfig, url: e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">HTTP Method</label>
                <select value={apiConfig.method} onChange={e => setApiConfig({...apiConfig, method: e.target.value})} className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-100">
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                </select>
              </div>
              <button onClick={() => executeDeployment('api')} disabled={isDeploying} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors flex justify-center items-center h-10">
                {isDeploying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : `Fire ${recordCount} Requests`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;