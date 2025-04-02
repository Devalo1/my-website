import React from 'react';
import TestFirebaseButton from '../components/TestFirebaseButton';

const DebugPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Pagină de Debug</h1>
      <TestFirebaseButton />
    </div>
  );
};

export default DebugPage;
