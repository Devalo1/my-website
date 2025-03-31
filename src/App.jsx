import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Acasa from './pages/Acasa';
import Produse from './pages/Produse';
import DespreNoi from './pages/DespreNoi';
import Contact from './pages/Contact';
import Terapie from './pages/Terapie/terapie';
import ONG from './pages/ONG';
import LupulSiCorbul from './pages/LupulSiCorbul';
import Consiliere from './pages/Consiliere';
import Psihoterapie from './pages/Psihoterapie';
import TerapiaPersonalizata from './pages/TerapiaPersonalizata';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Router basename="/my-website">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/acasa" />} />
            <Route path="/acasa" element={<Acasa />} />
            <Route path="/produse" element={<Produse />} />
            <Route path="/despre-noi" element={<DespreNoi />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terapie" element={<Terapie />} />
            <Route path="/ong" element={<ONG />} />
            <Route path="/lupul-si-corbul" element={<LupulSiCorbul />} />
            <Route path="/consiliere" element={<Consiliere />} />
            <Route path="/psihoterapie" element={<Psihoterapie />} />
            <Route path="/terapia-personalizata" element={<TerapiaPersonalizata />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;