// client/src/components/FieldEditor.tsx

import React from 'react';

type FieldDefinition = {
  type: string;
  min?: number;
  max?: number;
  choices?: string[];
};

type Props = {
  fieldName: string;
  definition: FieldDefinition;
  onChange: (fieldName: string, def: FieldDefinition) => void;
  onRemove: () => void;
};

const FieldEditor: React.FC<Props> = ({
  fieldName,
  definition,
  onChange,
  onRemove,
}) => {
  return (
    <div className="field-editor">
      <input
        value={fieldName}
        disabled
      />

      <select
        value={definition.type}
        onChange={e =>
          onChange(fieldName, {
            ...definition,
            type: e.target.value,
          })
        }
      >
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>

      <button onClick={onRemove}>✕</button>
    </div>
  );
};

export default FieldEditor;
