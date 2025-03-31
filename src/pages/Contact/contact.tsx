import './contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="content-card">
        <h1>Contact</h1>
        <p className="subtitle">Suntem aici pentru tine</p>
      </div>
      
      <div className="contact-content">
        <div className="content-card contact-info">
          <h2>Informații de Contact</h2>
          
          <div className="info-item">
            <strong>Adresă:</strong>
            <p>Strada Exemplu, Nr. 123, București, România</p>
          </div>
          
          <div className="info-item">
            <strong>Program:</strong>
            <p>Luni - Vineri: 10:00 - 18:00</p>
            <p>Sâmbătă: 10:00 - 14:00</p>
            <p>Duminică: Închis</p>
          </div>
          
          <div className="info-item">
            <strong>Telefon:</strong>
            <p>+40 723 456 789</p>
          </div>
          
          <div className="info-item">
            <strong>Email:</strong>
            <p>contact@lupulsicorbul.ro</p>
          </div>
          
          <div className="social-media">
            <h3>Urmărește-ne</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <i className="social-icon facebook">FB</i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="social-icon instagram">IG</i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="social-icon linkedin">IN</i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="content-card contact-form-container">
          <h2>Trimite-ne un Mesaj</h2>
          <p>Completează formularul de mai jos și te vom contacta cât mai curând posibil.</p>
          
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nume Complet</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subiect</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mesaj</label>
              <textarea id="message" name="message" rows={6} required></textarea>
            </div>
            
            <button type="submit" className="btn">Trimite Mesajul</button>
          </form>
        </div>
      </div>
      
      <div className="content-card map-container">
        <h2>Locația Noastră</h2>
        <div className="map-placeholder">
          <p>Hartă Google Maps ar trebui să apară aici</p>
          <p><small>Din motive de simplificare, harta este afișată ca un placeholder</small></p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
