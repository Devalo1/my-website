import React from 'react';
import '../styles/home.css';

const Acasa: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Bine ați venit la Lupul și Corbul</h1>
        <p>Prăjituri artizanale și suplimente naturale create cu pasiune</p>
      </div>
      
      <div className="about-section">
        <h2>Despre noi</h2>
        <p>
          La Lupul și Corbul, credem în puterea ingredientelor naturale și în bucuria 
          unui desert preparat cu dragoste. Fiecare produs al nostru este realizat 
          cu atenție și dedicare pentru a vă oferi o experiență culinară autentică.
        </p>
        
        <h3>Valorile noastre:</h3>
        <ol>
          <li>Ingrediente 100% naturale</li>
          <li>Rețete tradiționale adaptate pentru bunăstarea dumneavoastră</li>
          <li>Sustenabilitate și respect pentru natură</li>
          <li>Gust autentic fără compromisuri</li>
        </ol>
      </div>
      
      <div className="products-section">
        <h2>Produsele noastre</h2>
        <div className="product-categories">
          <div className="category">
            <h3>Prăjituri artizanale</h3>
            <p>Delicii dulci preparate cu ingrediente premium și multă pasiune.</p>
            <a href="/my-website/products" className="cta-button">Vezi prăjiturile</a>
          </div>
          <div className="category">
            <h3>Suplimente naturale</h3>
            <p>Formule unice ce îmbină tradiția cu știința pentru sănătatea ta.</p>
            <a href="/my-website/products" className="cta-button">Vezi suplimentele</a>
          </div>
        </div>
      </div>
      
      <div className="services-section">
        <h2>Serviciile noastre</h2>
        <div className="services">
          <div className="service">
            <h3>Terapie personalizată</h3>
            <p>Oferim sesiuni de terapie și consiliere adaptate nevoilor individuale.</p>
            <a href="/my-website/therapy" className="cta-button">Află mai multe</a>
          </div>
          <div className="service">
            <h3>ONG - Făuritorii de Destin</h3>
            <p>Organizația noastră non-profit dedicată sprijinirii comunității.</p>
            <a href="/my-website/ong" className="cta-button">Descoperă misiunea noastră</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acasa;
