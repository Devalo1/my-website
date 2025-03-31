import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Bine ați venit</h1>
        <p>Vă oferim servicii de terapie și consiliere de calitate</p>
        <div className="cta-buttons">
          <Link to="/terapie/consiliere" className="primary-button">Află mai mult</Link>
        </div>
      </div>
      
      <div className="services-grid">
        <h2>Serviciile noastre</h2>
        <div className="services-list">
          <div className="service-card">
            <h3>Consiliere</h3>
            <p>Consiliere psihologică pentru diverse probleme și situații</p>
            <Link to="/terapie/consiliere">Detalii</Link>
          </div>
          <div className="service-card">
            <h3>Psihoterapie</h3>
            <p>Tratarea problemelor emoționale și comportamentale</p>
            <Link to="/terapie/psihoterapie">Detalii</Link>
          </div>
          <div className="service-card">
            <h3>Terapie Personalizată</h3>
            <p>Programe adaptate nevoilor individuale</p>
            <Link to="/terapie/personalizata">Detalii</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
