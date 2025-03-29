import React from 'react';
import BackgroundVideo from './components/BackgroundVideo';
import './App.css';

function App() {
  return (
    <div className="home-container">
      <BackgroundVideo videoPath="/my-website/background.mov" />
      <div className="content">
        <h1>My Website</h1>
        <p>This is content that should be visible over the background video</p>
        <p className="error-info">
          Dacă nu vedeți videoclipul de fundal, cel mai probabil formatul MOV nu este suportat de browser.
          Vă recomandăm să:
          <ol style={{textAlign: 'left'}}>
            <li>Convertiți videoclipul în format MP4 folosind un convertor online</li>
            <li>Salvați fișierul MP4 în directorul "public" cu numele "background.mp4"</li>
          </ol>
        </p>
      </div>
    </div>
  );
}

export default App;