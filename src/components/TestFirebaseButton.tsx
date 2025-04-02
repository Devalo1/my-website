import React from 'react';
import { testFirebaseConnection } from '../firebase/testConnection';

const TestFirebaseButton: React.FC = () => {
  const handleTestClick = async () => {
    const result = await testFirebaseConnection();
    console.log('Rezultat test Firebase:', result);
    alert(result.success ? 'Conexiune reușită la Firebase!' : `Eroare: ${result.message}`);
  };

  return (
    <button 
      onClick={handleTestClick}
      style={{
        padding: '10px 15px',
        backgroundColor: '#4285F4',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px'
      }}
    >
      Testează conexiunea Firebase
    </button>
  );
};

export default TestFirebaseButton;
