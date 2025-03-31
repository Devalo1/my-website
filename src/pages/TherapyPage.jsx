import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const therapyTypes = {
  'consiliere': {
    title: 'Consiliere Psihologică',
    description: 'Servicii de consiliere psihologică pentru diverse probleme și situații de viață.',
    image: '/images/consiliere.jpg',
    content: `
      <p>Consilierea psihologică oferă sprijin și îndrumare pentru persoanele care se confruntă cu diverse provocări de viață. Acest proces vă ajută să:</p>
      <ul>
        <li>Dezvoltați abilități de gestionare a stresului</li>
        <li>Îmbunătățiți relațiile personale și profesionale</li>
        <li>Depășiți momentele dificile</li>
        <li>Luați decizii importante în mod echilibrat</li>
      </ul>
      <p>Sesiunile de consiliere sunt confidențiale și adaptate nevoilor dumneavoastră specifice.</p>
    `
  },
  'psihoterapie': {
    title: 'Psihoterapie',
    description: 'Terapie psihologică profesională pentru tratarea problemelor emoționale și comportamentale.',
    image: '/images/psihoterapie.jpg',
    content: `
      <p>Psihoterapia este un proces terapeutic mai profund și de durată, care abordează:</p>
      <ul>
        <li>Tulburări de anxietate și depresie</li>
        <li>Probleme de comportament</li>
        <li>Traume și experiențe dificile din trecut</li>
        <li>Dezvoltarea personală și autocunoașterea</li>
      </ul>
      <p>Lucrăm împreună pentru a vă ajuta să depășiți barierele care vă limitează potențialul.</p>
    `
  },
  'personalizata': {
    title: 'Terapia Personalizată',
    description: 'Programe de terapie create special pentru nevoile dumneavoastră unice.',
    image: '/images/terapie-personalizata.jpg',
    content: `
      <p>Terapia personalizată combină diverse metode și tehnici pentru a crea un plan de tratament adaptat perfect nevoilor dumneavoastră:</p>
      <ul>
        <li>Evaluare completă a nevoilor și obiectivelor</li>
        <li>Plan terapeutic flexibil și adaptabil</li>
        <li>Combinație de tehnici din diverse abordări terapeutice</li>
        <li>Monitorizare constantă a progresului</li>
      </ul>
      <p>Credem că fiecare persoană este unică și are nevoie de o abordare personalizată pentru a obține cele mai bune rezultate.</p>
    `
  }
};

export default function TherapyPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [therapy, setTherapy] = useState(null);
  
  useEffect(() => {
    // Check if the type exists in our therapy types
    if (type && therapyTypes[type]) {
      setTherapy(therapyTypes[type]);
      // Set document title
      document.title = therapyTypes[type].title;
    } else if (type) {
      // Redirect to home if type is invalid
      navigate('/');
    }
  }, [type, navigate]);
  
  if (!therapy) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="therapy-page">
      <div className="therapy-container">
        <div className="therapy-hero">
          <h1>{therapy.title}</h1>
          <img 
            src={therapy.image} 
            alt={therapy.title} 
            className="therapy-image" 
            onError={(e) => {
              e.target.src = '/images/cover.jpeg'; // Fallback image
            }}
          />
        </div>
        
        <div className="therapy-content">
          <div dangerouslySetInnerHTML={{ __html: therapy.content }} />
          
          <div className="therapy-cta">
            <h2>Programează o consultație</h2>
            <p>Suntem aici pentru a vă ajuta să vă îmbunătățiți viața și starea de bine.</p>
            <button className="primary-button">Programare</button>
          </div>
        </div>
      </div>
    </div>
  );
}
