import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TherapyPage from './pages/TherapyPage';
import Home from './pages/Home';
// Import other pages as needed

// Import styles with correct paths
import './styles/globals.css';
import './styles/navbar.css';
import './styles/therapy.css';

function App() {
  // Get the base path from import.meta.env
  const basePath = import.meta.env.BASE_URL || '/';

  return (
    <Router basename={basePath}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terapie/:type" element={<TherapyPage />} />
        {/* Add other routes here */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;