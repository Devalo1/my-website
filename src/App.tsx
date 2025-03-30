import { useEffect, useState } from 'react';
import './styles/styles.css'; // Importă fișierul CSS

// Obține baza URL pentru resurse
const getBasePath = () => {
  // În producție, folosește calea de bază definită în Vite
  if (import.meta.env.PROD) {
    return import.meta.env.BASE_URL;
  }
  // În dezvoltare, folosim root path
  return '/';
};

// Definim constanta pentru calea către imagine cu un fallback
const BASE_PATH = getBasePath();
const coverImagePath = `${BASE_PATH}images/cover.jpeg`;
const placeholderImagePath = `${BASE_PATH}images/placeholder.jpeg`;
const productImage1Path = `${BASE_PATH}images/product1.jpg`;
const productImage2Path = `${BASE_PATH}images/product2.jpg`;
const productImage3Path = `${BASE_PATH}images/product3.jpg`;

// Definim paginile disponibile în aplicație
type PageType = 'home' | 'products' | 'ong' | 'therapy' | 'contact';

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>(coverImagePath);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<number>(0);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  useEffect(() => {
    const verifyImage = async () => {
      const exists = await checkImageExists(coverImagePath);
      if (!exists) {
        setBackgroundImage(placeholderImagePath);
      }
    };

    verifyImage();
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.classList.toggle('active');
    }
  };

  const addToCart = () => {
    setCartItems(prevItems => prevItems + 1);
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Produs adăugat în coș!';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }, 10);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.classList.remove('active');
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('main-nav');
      const menuToggle = document.querySelector('.menu-toggle');

      if (nav && menuToggle &&
        !nav.contains(event.target as Node) &&
        !menuToggle.contains(event.target as Node)) {
        nav.classList.remove('active');
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    const adjustFontSize = () => {
      const viewportWidth = window.innerWidth;
      const baseSize = viewportWidth < 480 ? 14 : 16;
      document.documentElement.style.fontSize = baseSize + 'px';
    };

    window.addEventListener('resize', adjustFontSize);
    adjustFontSize();

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', adjustFontSize);
    };
  }, []);

  const videoSource = `${BASE_PATH}images/background.mov`;
  const videoSourceMP4 = `${BASE_PATH}images/background.mp4`;

  return (
    <div style={backgroundStyle} className="app-container">
      <header>
        <video autoPlay muted loop playsInline onError={(e) => {
          const videoElement = e.target as HTMLVideoElement;
          if (videoElement) {
            videoElement.style.display = 'none';
          }
        }}>
          <source src={videoSource} type="video/mp4" />
          <source src={videoSourceMP4} type="video/mp4" />
        </video>

        <div className="header-buttons right">
          <button
            className="profile-button"
            onClick={toggleProfile}
            aria-label="Profil utilizator"
          >
            <i className="fas fa-user"></i>
          </button>

          <button
            className="cart-button"
            onClick={toggleCart}
            aria-label="Coș de cumpărături"
          >
            <i className="fas fa-shopping-cart"></i>
            {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
          </button>
        </div>

        <h1>Lupul și Corbul</h1>
        <p>Prăjituri artizanale & Suplimente naturale</p>

        <button
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Meniu"
        >
          ☰
        </button>
      </header>

      <nav id="main-nav" className={isMenuOpen ? 'active' : ''}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className={currentPage === 'home' ? 'active' : ''}>Acasă</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('products'); }} className={currentPage === 'products' ? 'active' : ''}>Produse</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('ong'); }} className={currentPage === 'ong' ? 'active' : ''}>Făuritorii de Destin</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('therapy'); }} className={currentPage === 'therapy' ? 'active' : ''}>Terapie Personalizată</a>
        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} className={currentPage === 'contact' ? 'active' : ''}>Contact</a>
      </nav>

      <main className="page-container">
        {currentPage === 'home' && (
          <section className="page home-page">
            <div className="hero">
              <div>
                <h2>Prăjituri coapte cu dragoste</h2>
                <button onClick={() => navigateTo('products')}>Comandă acum</button>
              </div>
            </div>

            <div className="home-content">
              <h2>Bun venit în lumea noastră dulce</h2>
              <p>La Lupul și Corbul, fiecare produs este creat cu pasiune și ingrediente de calitate.</p>
              <p>Explorează meniul nostru și lasă-te surprins de combinații unice de arome.</p>

              <div className="cta-buttons">
                <button onClick={() => navigateTo('products')}>
                  <i className="fas fa-cookie-bite"></i> Vezi produsele
                </button>
                <button onClick={() => navigateTo('therapy')}>
                  <i className="fas fa-heartbeat"></i> Descoperă terapia
                </button>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'products' && (
          <section className="page products-page">
            <h2>Produsele noastre</h2>
            <div className="produse-grid">
              <div className="produs-card">
                <div className="product-image">
                  <img src={productImage1Path} alt="Prăjituri tradiționale" onError={(e) => {
                    e.currentTarget.src = placeholderImagePath;
                  }} />
                </div>
                <h3>Prăjituri tradiționale</h3>
                <p>Făcute după rețete autentice, cu ingrediente naturale și multă dragoste.</p>
                <p className="pret">25 RON</p>
                <button onClick={addToCart}>Adaugă în coș</button>
              </div>

              <div className="produs-card">
                <div className="product-image">
                  <img src={productImage2Path} alt="Suplimente naturale" onError={(e) => {
                    e.currentTarget.src = placeholderImagePath;
                  }} />
                </div>
                <h3>Suplimente naturale</h3>
                <p>Formule unice cu ingrediente proaspete ce susțin sănătatea organismului.</p>
                <p className="pret">45 RON</p>
                <button onClick={addToCart}>Adaugă în coș</button>
              </div>

              <div className="produs-card">
                <div className="product-image">
                  <img src={productImage3Path} alt="Pachete personalizate" onError={(e) => {
                    e.currentTarget.src = placeholderImagePath;
                  }} />
                </div>
                <h3>Pachete personalizate</h3>
                <p>Combină preferințele tale pentru o experiență unică de wellness.</p>
                <p className="pret">De la 65 RON</p>
                <button onClick={addToCart}>Adaugă în coș</button>
              </div>
            </div>

            <div className="page-navigation">
              <button onClick={() => navigateTo('home')}>
                <i className="fas fa-arrow-left"></i> Înapoi
              </button>
              <button onClick={() => navigateTo('ong')}>
                Înainte <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </section>
        )}

        {currentPage === 'ong' && (
          <section className="page ong-page">
            <h2>Făuritorii de Destin</h2>
            <div className="ong-content">
              <p>Misiunea noastră este să sprijinim comunități locale și să promovăm un stil de viață sănătos și sustenabil. O parte din profitul nostru este direcționat către programe educaționale și de sănătate.</p>
              <div className="mission-values">
                <div className="mission-card">
                  <i className="fas fa-hand-holding-heart"></i>
                  <h3>Sprijin comunitar</h3>
                  <p>Susținem proiecte locale care fac diferența în comunitate.</p>
                </div>
                <div className="mission-card">
                  <i className="fas fa-leaf"></i>
                  <h3>Sustenabilitate</h3>
                  <p>Ne angajăm să folosim resurse responsabil și să reducem impactul asupra mediului.</p>
                </div>
                <div className="mission-card">
                  <i className="fas fa-heart"></i>
                  <h3>Sănătate</h3>
                  <p>Promovăm un stil de viață echilibrat și sănătos.</p>
                </div>
              </div>
              <button className="learn-more-btn">Află mai multe</button>

              <div className="page-navigation">
                <button onClick={() => navigateTo('products')}>
                  <i className="fas fa-arrow-left"></i> Înapoi
                </button>
                <button onClick={() => navigateTo('therapy')}>
                  Înainte <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'therapy' && (
          <section className="page therapy-page">
            <h2>Terapie Personalizată</h2>
            <p>Oferim consultanță nutrițională și suport emoțional adaptat nevoilor tale individuale.</p>
            <div className="contact-form">
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nume" required />
                <input type="email" placeholder="Email" required />
                <input type="tel" placeholder="Telefon" />
                <textarea placeholder="Mesajul tău" rows={5} required></textarea>
                <button type="submit">Trimite cerere</button>
              </form>
            </div>

            <div className="page-navigation">
              <button onClick={() => navigateTo('ong')}>
                <i className="fas fa-arrow-left"></i> Înapoi
              </button>
              <button onClick={() => navigateTo('contact')}>
                Înainte <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </section>
        )}

        {currentPage === 'contact' && (
          <section className="page contact-page">
            <h2>Contact</h2>
            <div className="contact-info">
              <div className="contact-card">
                <i className="fas fa-map-marker-alt"></i>
                <h3>Adresă</h3>
                <p>Strada Exemplu nr. 1, București</p>
              </div>

              <div className="contact-card">
                <i className="fas fa-phone"></i>
                <h3>Telefon</h3>
                <p>0722 000 000</p>
              </div>

              <div className="contact-card">
                <i className="fas fa-envelope"></i>
                <h3>Email</h3>
                <p>contact@lupulsicorbul.ro</p>
              </div>
            </div>

            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            </div>

            <div className="page-navigation">
              <button onClick={() => navigateTo('therapy')}>
                <i className="fas fa-arrow-left"></i> Înapoi
              </button>
              <button onClick={() => navigateTo('home')}>
                Înapoi la început <i className="fas fa-home"></i>
              </button>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Lupul și Corbul. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
};

export default App;
