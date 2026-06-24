import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

// 1. Added 'id' here so it perfectly matches App.tsx!
type FieldDefinition = {
  id: string;
  name: string;
  type: string;
};

type Props = {
  id: string;
  field: FieldDefinition;
  onChange: (id: string, updatedField: FieldDefinition) => void;
  onRemove: (id: string) => void;
};

const FieldEditor: React.FC<Props> = ({ id, field, onChange, onRemove }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
      
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Field Name</label>
        <input
          type="text"
          value={field.name}
          onChange={(e) => onChange(id, { ...field, name: e.target.value })}
          className="w-full font-mono text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="e.g. user_id"
        />
      </div>

      <div className="w-1/3">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Data Type</label>
        <select
          value={field.type}
          onChange={(e) => onChange(id, { ...field, type: e.target.value })}
          className="w-full bg-gray-50 text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <optgroup label="Primitives">
            <option value="string">String</option>
            <option value="integer">Integer</option>
            <option value="float">Float</option>
            <option value="boolean">Boolean</option>
          </optgroup>
          <optgroup label="Semantic">
            <option value="uuid">UUID</option>
            <option value="name">Full Name</option>
            <option value="email">Email Address</option>
            <option value="date">Date</option>
            <option value="image_url">Image URL</option>
          </optgroup>
        </select>
      </div>

      <div className="pt-5">
        <button 
          onClick={() => onRemove(id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Remove Field"
        >
          {/* @ts-ignore - Bypassing React 19 type lag */}
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FieldEditor;