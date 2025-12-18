// client/src/components/OutputDisplay.tsx

import React from 'react';
import JsonView from '@uiw/react-json-view';

type Props = {
  data: any[] | null;
};

const OutputDisplay: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="output">
      <h2>Generated Output</h2>
      <JsonView value={data} collapsed={2} />
    </div>
  );
};

export default OutputDisplay;
