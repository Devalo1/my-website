import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Componenta de loading pentru afișare în timp ce se încarcă datele
const Loading: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <Spin indicator={antIcon} />
      <p style={{ marginTop: 16, color: '#555' }}>Se încarcă...</p>
    </div>
  );
};

export default Loading;
