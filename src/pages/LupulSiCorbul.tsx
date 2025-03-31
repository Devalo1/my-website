import React from 'react';
import BackgroundImage from '../components/BackgroundVideo';
import '../styles/LupulSiCorbul.css';

const LupulSiCorbul: React.FC = () => {
  return (
    <div className="lupul-corbul-page">
      <BackgroundImage />
      <div className="content">
        <h1>Lupul și Corbul</h1>
        <p>Bine ați venit pe pagina noastră!</p>
        <div className="action-buttons">
          <button className="action-button">Află mai multe</button>
          <button className="action-button secondary">Contact</button>
        </div>
      </div>
    </div>
  );
};

export default LupulSiCorbul;
