import './terapie.css';

const Terapie = () => {
  return (
    <div className="therapy-container">
      <div className="content-card">
        <h1>Terapie Personalizată</h1>
        <p className="subtitle">Călătoria ta spre echilibru și vindecare interioară</p>
        
        <div className="therapy-intro">
          <p>
            La Lupul și Corbul, credem în puterea terapiei personalizate și în importanța 
            abordării fiecărei persoane ca fiind unică. Oferim o varietate de servicii terapeutice, 
            toate adaptate nevoilor specifice ale fiecărui client.
          </p>
        </div>
      </div>
      
      <div className="therapy-services">
        <div className="content-card service-card">
          <h2>Consiliere Individuală</h2>
          <p>
            Sesiunile noastre de consiliere individuală oferă un spațiu sigur pentru explorarea 
            provocărilor personale, dezvoltarea strategiilor de coping și lucrul spre obiectivele tale.
          </p>
          <p className="service-details">Durată: 50 minute | Preț: 200 RON/ședință</p>
        </div>
        
        <div className="content-card service-card">
          <h2>Terapie de Cuplu</h2>
          <p>
            Terapia de cuplu se concentrează pe îmbunătățirea comunicării, rezolvarea conflictelor 
            și întărirea conexiunii dintre parteneri.
          </p>
          <p className="service-details">Durată: 80 minute | Preț: 300 RON/ședință</p>
        </div>
        
        <div className="content-card service-card">
          <h2>Terapie prin Artă</h2>
          <p>
            Terapia prin artă folosește procesul creativ pentru a explora emoțiile, reduce stresul 
            și îmbunătăți starea de bine. Nu este necesară experiență artistică prealabilă.
          </p>
          <p className="service-details">Durată: 90 minute | Preț: 250 RON/ședință</p>
        </div>
        
        <div className="content-card service-card">
          <h2>Meditație Ghidată</h2>
          <p>
            Sesiunile de meditație ghidată te ajută să îți dezvolți conștientizarea, să reduci anxietatea 
            și să îmbunătățești claritatea mentală.
          </p>
          <p className="service-details">Durată: 60 minute | Preț: 180 RON/ședință</p>
        </div>
      </div>
      
      <div className="content-card appointment-section">
        <h2>Programează o Ședință</h2>
        <p>
          Pentru a programa o ședință sau pentru a afla mai multe despre serviciile noastre de terapie, 
          te rugăm să completezi formularul de mai jos sau să ne contactezi direct.
        </p>
        
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nume</label>
            <input type="text" id="name" name="name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input type="tel" id="phone" name="phone" />
          </div>
          
          <div className="form-group">
            <label htmlFor="service">Serviciu Dorit</label>
            <select id="service" name="service">
              <option value="">Selectează un serviciu</option>
              <option value="individual">Consiliere Individuală</option>
              <option value="couple">Terapie de Cuplu</option>
              <option value="art">Terapie prin Artă</option>
              <option value="meditation">Meditație Ghidată</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Mesaj</label>
            <textarea id="message" name="message" rows={5}></textarea>
          </div>
          
          <button type="submit" className="btn">Trimite Cererea</button>
        </form>
      </div>
    </div>
  );
};

export default Terapie;
