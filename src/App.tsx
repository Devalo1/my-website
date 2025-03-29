import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <Router basename="/my-website">
      <div className="App">
        {/* Fundal direct din folderul public */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundImage: 'url(/my-website/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="content">
          <h1>My Website</h1>
          <p>This is content that should be visible over the background</p>
        </div>
      </div>
    </Router>
  );
};

// Asigură-te că toate căile încep cu '/my-website/'
// Exemplu: în loc de <img src="/imagini/poza.jpg" />
// folosește <img src="/my-website/imagini/poza.jpg" />

export default App;
