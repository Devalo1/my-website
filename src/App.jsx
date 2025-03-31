import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LupulSiCorbul from './pages/LupulSiCorbul';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/lupul-si-corbul" />} />
        <Route path="/lupul-si-corbul" element={<LupulSiCorbul />} />
        {/* Alte rute pot fi adăugate aici */}
      </Routes>
    </div>
  );
}

export default App;