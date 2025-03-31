import React, { useState } from 'react';
import '../styles/home.css';

const Acasa = () => {
  const [showPopup, setShowPopup] = useState(true);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home-container">
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h1>Bine ați venit la Lupul și Corbul</h1>
            <p>Prăjituri artizanale și suplimente naturale create cu pasiune</p>
            <p>
              La Lupul și Corbul, credem în puterea ingredientelor naturale și în bucuria 
              unui desert preparat cu dragoste. Fiecare produs al nostru este realizat 
              cu atenție și dedicare pentru a vă oferi o experiență culinară autentică.
            </p>
            <button className="close-popup" onClick={closePopup}>Închide</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Acasa;
