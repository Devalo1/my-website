import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Result
        status="404"
        title="404"
        subTitle="Ne pare rău, pagina pe care o căutați nu există."
        extra={
          <Link to="/">
            <Button type="primary">Înapoi la pagina principală</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
