/**
 * CONTROLLER UNIFICAT PENTRU BUTONUL DE PROFIL PE MOBIL
 * 
 * Acest fișier este SINGURA sursă de funcționalitate pentru butonul de profil
 * pe dispozitive mobile. Toate acțiunile și interacțiunile utilizatorului
 * cu profilul sunt gestionate aici pentru a evita conflictele.
 */

(function() {
    // Define DEBUG variable to control console output
    const DEBUG = process.env.NODE_ENV === 'development' || false;
    
    function debug(message) {
        if (DEBUG) console.log("ProfileButton: " + message);
    }
    
    debug("Script inițiat");

    // IMPORTANT: RULEAZĂ STRICT DOAR PE MOBIL
    if (window.innerWidth > 768 || document.documentElement.clientWidth > 768) {
        debug('Ecran desktop detectat, script oprit.');
        return;
    }

    // Flag pentru a preveni dublarea inițializării
    window.MOBILE_USER_BUTTON_INITIALIZED = window.MOBILE_USER_BUTTON_INITIALIZED || false;
    
    // Dacă a fost deja inițializat, nu executa din nou
    if (window.MOBILE_USER_BUTTON_INITIALIZED) {
        debug('Butonul utilizator mobil a fost deja inițializat.');
        return;
    }
    
    // Setează flag-ul de inițializare
    window.MOBILE_USER_BUTTON_INITIALIZED = true;
    
    // Indică că acest script gestionează butonul de profil pe mobil
    window.PROFILE_BUTTON_MANAGED_BY = 'utilizator-button-function.js';
    
    // Fă funcțiile disponibile global pentru utilizare în auto-inject.js
    window.MobileUserButton = {};
    
    // Stare internă
    let menuOpen = false;

    // Variabile pentru Firebase
    let firebaseInitialized = false;
    let auth = null;
    let db = null;
    let googleProvider = null;
    
    /**
     * Inițializează Firebase dacă nu este deja inițializat
     */
    function initializeFirebase() {
        if (firebaseInitialized) return true;
        
        debug("Inițializez Firebase");
        
        // Verifică dacă Firebase SDK este încărcat
        if (typeof firebase === 'undefined') {
            debug("Firebase SDK nu este încărcat, încercăm să îl încărcăm dinamic");
            
            // Încercăm să încărcăm Firebase SDK dinamic
            const firebaseScript = document.createElement('script');
            firebaseScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js";
            document.head.appendChild(firebaseScript);
            
            const authScript = document.createElement('script');
            authScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js";
            document.head.appendChild(authScript);
            
            const firestoreScript = document.createElement('script');
            firestoreScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js";
            document.head.appendChild(firestoreScript);
            
            const analyticsScript = document.createElement('script');
            analyticsScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics-compat.js";
            document.head.appendChild(analyticsScript);
            
            // Încercăm să inițializăm Firebase peste 1 secundă
            setTimeout(setupFirebase, 1000);
            return false;
        }
        
        return setupFirebase();
    }
    
    /**
     * Configurează Firebase cu cheia API corectă
     */
    function setupFirebase() {
        if (firebaseInitialized) return true;
        
        if (typeof firebase === 'undefined') {
            debug("Firebase SDK încă nu este disponibil");
            return false;
        }
        
        try {
            debug("Configurez Firebase");
            
            // Configurația Firebase actualizată
            const firebaseConfig = {
                apiKey: "AIzaSyABtSj1pfyU6lbwoLt55f_2F5TgfhSBK6g",
                authDomain: "fir-web-c1a1d.firebaseapp.com",
                projectId: "fir-web-c1a1d",
                storageBucket: "fir-web-c1a1d.firebasestorage.app",
                messagingSenderId: "244211979994",
                appId: "1:244211979994:web:bd1f0beb57c455a96ef7e3",
                measurementId: "G-SR3X50VEN3"
            };
            
            // Inițializează Firebase dacă nu există deja
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            // Obține serviciile necesare
            auth = firebase.auth();
            db = firebase.firestore();
            googleProvider = new firebase.auth.GoogleAuthProvider();
            
            // Activează Analytics
            const analytics = firebase.analytics();
            
            // Setează listener pentru schimbări de autentificare
            auth.onAuthStateChanged(handleAuthStateChanged);
            
            firebaseInitialized = true;
            debug("Firebase inițializat cu succes");
            return true;
        } catch (error) {
            debug("Eroare la inițializarea Firebase: " + error.message);
            return false;
        }
    }
    
    /**
     * Gestionează schimbările stării de autentificare și salvează datele în Firestore
     */
    function handleAuthStateChanged(user) {
        debug("Stare autentificare schimbată: " + (user ? "Utilizator autentificat" : "Neautentificat"));
        
        if (user) {
            // Actualizăm informațiile utilizatorului în localStorage pentru compatibilitate
            const userData = {
                uid: user.uid,
                name: user.displayName || 'Utilizator',
                email: user.email || '',
                photoURL: user.photoURL || '',
                isFirebaseUser: true
            };
            
            try {
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (e) {
                debug("Eroare la salvarea utilizatorului în localStorage: " + e.message);
            }
            
            // Actualizăm datele utilizatorului în Firestore
            db.collection('users').doc(user.uid).set({
                name: user.displayName || 'Utilizator',
                email: user.email || '',
                photoURL: user.photoURL || '',
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                // Folosim merge pentru a nu suprascrie date existente
            }, { merge: true })
            .then(() => {
                debug("Datele utilizatorului actualizate în Firestore");
            })
            .catch((error) => {
                debug("Eroare la actualizarea datelor în Firestore: " + error.message);
            });
            
            // Actualizăm interfața
            updateProfileMenuState();
        } else {
            // Eliminăm utilizatorul din localStorage
            try {
                localStorage.removeItem('user');
            } catch (e) {
                debug("Eroare la ștergerea utilizatorului din localStorage: " + e.message);
            }
            
            // Actualizăm interfața
            updateProfileMenuState();
        }
    }
    
    /**
     * Creează containerul și elementele meniului de profil
     */
    function createMobileProfileMenu() {
        debug("Creare meniu profil mobil");
        
        // Verifică dacă elementul există deja
        if (document.getElementById('mobile-profile-menu-container')) {
            debug("Meniul există deja");
            return;
        }
        
        // Creează containerul principal
        const container = document.createElement('div');
        container.id = 'mobile-profile-menu-container';
        container.innerHTML = `
            <div class="mobile-profile-overlay"></div>
            <div class="mobile-profile-menu">
                <div class="mobile-profile-header">
                    <div class="mobile-profile-avatar">
                        <img src="images/profi.png" alt="Profil">
                        <div class="mobile-profile-ripple"></div>
                    </div>
                    <div class="mobile-profile-info">
                        <h3 id="mobile-profile-name">Cont utilizator</h3>
                        <p id="mobile-profile-email">Conectează-te pentru a continua</p>
                    </div>
                    <button class="mobile-profile-close">✖</button>
                </div>
                <div class="mobile-profile-content">
                    <div class="mobile-profile-actions logged-out">
                        <a href="#" class="mobile-profile-button login-button">
                            <span class="icon">🔑</span>
                            <span class="text">Autentificare</span>
                        </a>
                        <a href="#" class="mobile-profile-button register-button">
                            <span class="icon">✏️</span>
                            <span class="text">Înregistrare</span>
                        </a>
                        <div class="mobile-profile-divider">
                            <span>sau</span>
                        </div>
                        <a href="#" class="mobile-profile-button social-button google-button">
                            <span class="icon">🌐</span>
                            <span class="text">Continuă cu Google</span>
                        </a>
                    </div>
                    <div class="mobile-profile-actions logged-in">
                        <a href="#" class="mobile-profile-button account-button">
                            <span class="icon">👤</span>
                            <span class="text">Contul meu</span>
                        </a>
                        <a href="#" class="mobile-profile-button orders-button">
                            <span class="icon">📦</span>
                            <span class="text">Comenzile mele</span>
                        </a>
                        <a href="#" class="mobile-profile-button wishlist-button">
                            <span class="icon">❤️</span>
                            <span class="text">Favorite</span>
                        </a>
                        <a href="#" class="mobile-profile-button settings-button">
                            <span class="icon">⚙️</span>
                            <span class="text">Setări</span>
                        </a>
                        <div class="mobile-profile-divider"></div>
                        <a href="#" class="mobile-profile-button logout-button">
                            <span class="icon">🚪</span>
                            <span class="text">Deconectare</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Adaugă stiluri premium pentru animații și design
        const style = document.createElement('style');
        style.textContent = `
            #mobile-profile-menu-container {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000000;
                pointer-events: none;
            }
            
            .mobile-profile-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0);
                transition: background 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                pointer-events: auto;
                backdrop-filter: blur(0px);
                -webkit-backdrop-filter: blur(0px);
            }
            
            .mobile-profile-menu {
                position: absolute;
                top: 0;
                right: 0;
                width: 85%;
                max-width: 320px;
                height: 100%;
                background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
                transform: translateX(105%);
                transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                box-shadow: -5px 0 25px rgba(0, 0, 0, 0);
                display: flex;
                flex-direction: column;
                pointer-events: auto;
                overflow: hidden;
                border-radius: 0;
            }
            
            /* Clasa pentru afișarea meniului */
            #mobile-profile-menu-container.open {
                display: block !important;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-overlay {
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
            }
            
            #mobile-profile-menu-container.open .mobile-profile-menu {
                transform: translateX(0);
                box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
                border-radius: 20px 0 0 20px;
            }
            
            .mobile-profile-header {
                padding: 25px 20px;
                background: linear-gradient(135deg, #6b4423 0%, #8b5a2b 100%);
                color: white;
                display: flex;
                align-items: center;
                position: relative;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .mobile-profile-avatar {
                position: relative;
                width: 60px;
                height: 60px;
                margin-right: 15px;
                overflow: hidden;
                border-radius: 50%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.7);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .mobile-profile-avatar:active {
                transform: scale(0.95);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
            
            .mobile-profile-avatar img {
                width: 70%;
                height: 70%;
                object-fit: cover;
                border-radius: 50%;
                z-index: 1;
                transition: transform 0.3s ease;
            }
            
            .mobile-profile-avatar:hover img {
                transform: scale(1.1);
            }
            
            .mobile-profile-ripple {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 0;
            }
            
            .mobile-profile-info {
                flex: 1;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-info {
                opacity: 1;
                transform: translateY(0);
            }
            
            .mobile-profile-info h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
            
            .mobile-profile-info p {
                margin: 0;
                font-size: 14px;
                opacity: 0.8;
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            }
            
            .mobile-profile-close {
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                padding: 8px;
                opacity: 0.8;
                transition: opacity 0.2s, transform 0.2s;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.1);
                opacity: 0;
                transform: translateX(10px);
                transition: opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-close {
                opacity: 0.8;
                transform: translateX(0);
            }
            
            .mobile-profile-close:hover {
                opacity: 1;
                background: rgba(0, 0, 0, 0.2);
                transform: rotate(90deg);
            }
            
            .mobile-profile-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }
            
            .mobile-profile-actions {
                display: none;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .mobile-profile-actions.logged-out {
                display: block;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-actions {
                opacity: 1;
                transform: translateY(0);
                transition-delay: 0.2s;
            }
            
            .mobile-profile-button {
                display: flex;
                align-items: center;
                padding: 16px;
                margin-bottom: 12px;
                background: white;
                color: #333;
                text-decoration: none;
                border-radius: 12px;
                transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
                position: relative;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                opacity: 0;
                transform: translateY(20px);
            }
            
            #mobile-profile-menu-container.open .mobile-profile-button {
                animation: slideInUp 0.5s forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            #mobile-profile-menu-container.open .mobile-profile-button:nth-child(1) {
                animation-delay: 0.3s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-button:nth-child(2) {
                animation-delay: 0.4s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-button:nth-child(3) {
                animation-delay: 0.5s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-button:nth-child(4) {
                animation-delay: 0.6s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-button:nth-child(5) {
                animation-delay: 0.7s;
            }
            
            .mobile-profile-button:active {
                transform: scale(0.97);
                box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
            }
            
            .mobile-profile-button:hover {
                background: #f8f8f8;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .mobile-profile-button .icon {
                margin-right: 14px;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background: #f5f5f5;
                border-radius: 10px;
                transition: background 0.3s, transform 0.3s;
            }
            
            .mobile-profile-button:hover .icon {
                transform: scale(1.1);
                background: #ebebeb;
            }
            
            .mobile-profile-button .text {
                font-size: 15px;
                font-weight: 500;
                flex: 1;
            }
            
            .mobile-profile-button.login-button {
                background: linear-gradient(135deg, #6b4423 0%, #8b5a2b 100%);
                color: white;
            }
            
            .mobile-profile-button.login-button .icon {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .mobile-profile-button.login-button:hover .icon {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .mobile-profile-button.register-button {
                background: linear-gradient(135deg, #8b5a2b 0%, #a36b36 100%);
                color: white;
            }
            
            .mobile-profile-button.register-button .icon {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .mobile-profile-button.register-button:hover .icon {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .mobile-profile-divider {
                position: relative;
                text-align: center;
                margin: 20px 0;
                opacity: 0;
                transform: scale(0.9);
                transition: opacity 0.5s ease, transform 0.5s ease;
                transition-delay: 0.5s;
            }
            
            #mobile-profile-menu-container.open .mobile-profile-divider {
                opacity: 1;
                transform: scale(1);
            }
            
            .mobile-profile-divider:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #ddd;
            }
            
            .mobile-profile-divider span {
                position: relative;
                display: inline-block;
                padding: 0 12px;
                background: #f5f5f5;
                color: #999;
                font-size: 13px;
                border-radius: 10px;
            }
            
            /* Ripple effect pentru butoane */
            .mobile-profile-button:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.5);
                opacity: 0;
                border-radius: 100%;
                transform: scale(1) translate(-50%, -50%);
                transform-origin: 50% 50%;
            }
            
            .mobile-profile-button:active:after {
                animation: ripple 0.6s ease-out;
            }
            
            @keyframes ripple {
                0% {
                    transform: scale(0) translate(-50%, -50%);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(20) translate(-50%, -50%);
                    opacity: 0;
                }
            }
            
            /* Animație de pulsare pentru butonul profil */
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(107, 68, 35, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 8px rgba(107, 68, 35, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(107, 68, 35, 0);
                }
            }
            
            .pulse-effect {
                animation: pulse 2s infinite;
                border-radius: 50%;
            }
            
            /* Îmbunătățiri pentru scroll */
            .mobile-profile-content::-webkit-scrollbar {
                width: 4px;
            }
            
            .mobile-profile-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .mobile-profile-content::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
            }
        `;
        
        // Adaugă elementele în DOM
        document.head.appendChild(style);
        document.body.appendChild(container);
        debug("Meniu profil adăugat în DOM");
        
        // Adaugă event listeners
        container.querySelector('.mobile-profile-close').addEventListener('click', function(e) {
            debug("Click pe butonul de închidere");
            e.preventDefault();
            e.stopPropagation();
            closeProfileMenu();
        });
        
        container.querySelector('.mobile-profile-overlay').addEventListener('click', function(e) {
            debug("Click pe overlay");
            e.preventDefault();
            e.stopPropagation();
            closeProfileMenu();
        });
        
        // Event listeners pentru butoane
        container.querySelector('.login-button').addEventListener('click', function(e) {
            e.preventDefault();
            closeProfileMenu();
            loginWithEmail();
        });
        
        container.querySelector('.register-button').addEventListener('click', function(e) {
            e.preventDefault();
            closeProfileMenu();
            registerWithEmail();
        });
        
        container.querySelector('.google-button').addEventListener('click', function(e) {
            e.preventDefault();
            closeProfileMenu();
            loginWithGoogle();
        });
        
        container.querySelector('.logout-button').addEventListener('click', function(e) {
            e.preventDefault();
            closeProfileMenu();
            logout();
        });
    }
    
    /**
     * Deschide meniul de profil cu animație
     */
    function openProfileMenu() {
        debug("Încercare deschidere meniu profil");
        
        // Asigură-te că meniul există
        if (!document.getElementById('mobile-profile-menu-container')) {
            debug("Meniul nu există, îl creez acum");
            createMobileProfileMenu();
        }
        
        // Actualizează starea de logare
        updateProfileMenuState();
        
        const container = document.getElementById('mobile-profile-menu-container');
        if (!container) {
            debug("Container negăsit după creare!");
            return;
        }
        
        // Adaugă un efect special de pulsare pe butonul de profil
        const profileButton = document.getElementById('profile-button-v7');
        if (profileButton) {
            profileButton.classList.add('pulse-effect');
            setTimeout(() => {
                profileButton.classList.remove('pulse-effect');
            }, 2000);
        }
        
        // Forțează display: block pentru a asigura vizibilitatea
        container.style.display = 'block';
        
        // Declanșăm ripple effect pe avatar cu întârziere
        setTimeout(() => {
            const ripple = container.querySelector('.mobile-profile-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.animation = 'none';
                
                // Force reflow
                void ripple.offsetWidth;
                
                // Adaugă animația de ripple
                ripple.style.animation = 'ripple 0.8s ease-out forwards';
            }
        }, 300);
        
        // Deschide meniul - folosim setTimeout pentru a asigura tranziția fluidă
        setTimeout(() => {
            container.classList.add('open');
        }, 10);
        
        menuOpen = true;
        debug("Meniu profil deschis");
        
        // Previne scroll pe body
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Închide meniul de profil cu animație
     */
    function closeProfileMenu() {
        debug("Închidere meniu profil");
        const container = document.getElementById('mobile-profile-menu-container');
        if (!container) {
            debug("Container negăsit la închidere!");
            return;
        }
        
        // Animație de ieșire
        container.classList.add('closing');
        container.classList.remove('open');
        menuOpen = false;
        
        // Ascunde complet după animație pentru a permite alte interacțiuni
        setTimeout(() => {
            container.style.display = 'none';
            container.classList.remove('closing');
        }, 500);
        
        // Permite scroll pe body
        document.body.style.overflow = '';
        debug("Meniu profil închis");
    }
    
    /**
     * Actualizează starea meniului în funcție de statusul de autentificare
     */
    function updateProfileMenuState() {
        const container = document.getElementById('mobile-profile-menu-container');
        if (!container) return;
        
        let user = null;
        
        // Verifică mai întâi Firebase auth
        if (auth && auth.currentUser) {
            user = {
                name: auth.currentUser.displayName || 'Utilizator',
                email: auth.currentUser.email || '',
                uid: auth.currentUser.uid,
                photoURL: auth.currentUser.photoURL
            };
        } else {
            // Fallback la localStorage pentru compatibilitate
            try {
                user = JSON.parse(localStorage.getItem('user'));
            } catch (e) {
                debug("Eroare la citirea datelor utilizator din localStorage: " + e.message);
            }
        }
        
        const nameEl = container.querySelector('#mobile-profile-name');
        const emailEl = container.querySelector('#mobile-profile-email');
        const loggedOutActions = container.querySelector('.mobile-profile-actions.logged-out');
        const loggedInActions = container.querySelector('.mobile-profile-actions.logged-in');
        
        if (user) {
            nameEl.textContent = user.name || 'Utilizator';
            emailEl.textContent = user.email || '';
            loggedOutActions.style.display = 'none';
            loggedInActions.style.display = 'block';
            container.querySelector('.mobile-profile-header').classList.add('logged-in');
            
            // Actualizăm și poza de profil dacă există
            const avatarImg = container.querySelector('.mobile-profile-avatar img');
            if (avatarImg && user.photoURL) {
                avatarImg.src = user.photoURL;
            }
        } else {
            nameEl.textContent = 'Cont utilizator';
            emailEl.textContent = 'Conectează-te pentru a continua';
            loggedOutActions.style.display = 'block';
            loggedInActions.style.display = 'none';
            container.querySelector('.mobile-profile-header').classList.remove('logged-in');
            
            // Resetăm poza de profil
            const avatarImg = container.querySelector('.mobile-profile-avatar img');
            if (avatarImg) {
                avatarImg.src = 'images/profi.png';
            }
        }
    }
    
    /**
     * Gestionează click pe butonul de profil
     */
    function handleProfileButtonClick(e) {
        debug("Click pe butonul de profil");
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (!menuOpen) {
            openProfileMenu();
        } else {
            closeProfileMenu();
        }
    }
    
    /**
     * Afișează un dialog de autentificare firebase
     */
    function loginWithEmail() {
        debug("Autentificare cu email");
        if (!initializeFirebase()) {
            debug("Firebase nu este disponibil pentru autentificare");
            fallbackLogin();
            return;
        }
        
        // Verifică dacă există container auth deja
        let loginContainer = document.getElementById('login-container');
        
        if (loginContainer) {
            loginContainer.classList.add('active');
            
            // Adaugă handler personalizat pentru trimiterea formularului
            const form = loginContainer.querySelector('form');
            if (form) {
                form.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const email = loginContainer.querySelector('input[type="email"]').value;
                    const password = loginContainer.querySelector('input[type="password"]').value;
                    
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            debug("Autentificare reușită");
                            loginContainer.classList.remove('active');
                        })
                        .catch((error) => {
                            debug("Eroare la autentificare: " + error.message);
                            alert("Eroare la autentificare: " + error.message);
                        });
                };
            }
            
            return;
        }
        
        // Construim dialog personalizat dacă nu există unul
        loginContainer = document.createElement('div');
        loginContainer.id = 'login-container';
        loginContainer.className = 'auth-container';
        loginContainer.innerHTML = `
            <h2>Autentificare</h2>
            <form id="firebase-login-form">
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Parolă" required>
                <button type="submit">Autentificare</button>
            </form>
            <p>Nu ai cont? <span class="auth-toggle" id="show-register">Înregistrează-te</span></p>
            <div class="auth-divider"><span>sau</span></div>
            <button class="google-auth-btn">Continuă cu Google</button>
            <button class="close-auth">Închide</button>
        `;
        
        // Adăugăm stiluri pentru dialog
        const style = document.createElement('style');
        style.textContent = `
            .auth-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 350px;
                z-index: 2000000;
                display: none;
            }
            
            .auth-container.active {
                display: block;
            }
            
            .auth-container h2 {
                margin-bottom: 15px;
                color: #333;
            }
            
            .auth-container input {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            
            .auth-container button {
                width: 100%;
                padding: 12px;
                background: #6b4423;
                color: white;
                border: none;
                border-radius: 5px;
                margin-bottom: 10px;
                cursor: pointer;
            }
            
            .auth-container button:hover {
                background: #8b5a2b;
            }
            
            .auth-container p {
                margin: 10px 0;
                font-size: 14px;
            }
            
            .auth-toggle {
                color: #6b4423;
                cursor: pointer;
                text-decoration: underline;
            }
            
            .auth-divider {
                position: relative;
                text-align: center;
                margin: 15px 0;
            }
            
            .auth-divider:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #ddd;
            }
            
            .auth-divider span {
                position: relative;
                background: white;
                padding: 0 10px;
                color: #666;
            }
            
            .close-auth {
                background: #f5f5f5 !important;
                color: #333 !important;
            }
            
            .google-auth-btn {
                background: #4285f4;
            }
            
            .google-auth-btn:hover {
                background: #2b6def;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loginContainer);
        
        // Activăm dialogul
        loginContainer.classList.add('active');
        
        // Adăugăm event listeners
        const form = loginContainer.querySelector('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = loginContainer.querySelector('input[type="email"]').value;
            const password = loginContainer.querySelector('input[type="password"]').value;
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    debug("Autentificare reușită");
                    loginContainer.classList.remove('active');
                })
                .catch((error) => {
                    debug("Eroare la autentificare: " + error.message);
                    alert("Eroare la autentificare: " + error.message);
                });
        });
        
        // Toggle pentru înregistrare
        loginContainer.querySelector('#show-register').addEventListener('click', function() {
            loginContainer.classList.remove('active');
            registerWithEmail();
        });
        
        // Buton Google
        loginContainer.querySelector('.google-auth-btn').addEventListener('click', function() {
            loginContainer.classList.remove('active');
            loginWithGoogle();
        });
        
        // Buton închidere
        loginContainer.querySelector('.close-auth').addEventListener('click', function() {
            loginContainer.classList.remove('active');
        });
    }
    
    /**
     * Afișează un dialog de înregistrare firebase
     */
    function registerWithEmail() {
        debug("Înregistrare cu email");
        if (!initializeFirebase()) {
            debug("Firebase nu este disponibil pentru înregistrare");
            fallbackRegister();
            return;
        }
        
        // Verifică dacă există container auth deja
        let registerContainer = document.getElementById('register-container');
        
        if (registerContainer) {
            registerContainer.classList.add('active');
            
            // Adaugă handler personalizat pentru trimiterea formularului
            const form = registerContainer.querySelector('form');
            if (form) {
                form.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const name = registerContainer.querySelector('input[type="text"]').value;
                    const email = registerContainer.querySelector('input[type="email"]').value;
                    const password = registerContainer.querySelector('input[type="password"]').value;
                    
                    auth.createUserWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Actualizăm profilul utilizatorului
                            return userCredential.user.updateProfile({
                                displayName: name
                            }).then(() => {
                                // Salvăm utilizatorul în Firestore
                                return db.collection('users').doc(userCredential.user.uid).set({
                                    name: name,
                                    email: email,
                                    createdAt: new Date(),
                                });
                            });
                        })
                        .then(() => {
                            debug("Înregistrare reușită");
                            registerContainer.classList.remove('active');
                        })
                        .catch((error) => {
                            debug("Eroare la înregistrare: " + error.message);
                            alert("Eroare la înregistrare: " + error.message);
                        });
                };
            }
            
            return;
        }
        
        // Construim dialog personalizat dacă nu există unul
        registerContainer = document.createElement('div');
        registerContainer.id = 'register-container';
        registerContainer.className = 'auth-container';
        registerContainer.innerHTML = `
            <h2>Înregistrare</h2>
            <form id="firebase-register-form">
                <input type="text" placeholder="Nume" required>
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Parolă" required>
                <div id="password-strength"></div>
                <button type="submit">Înregistrare</button>
            </form>
            <p>Ai deja cont? <span class="auth-toggle" id="show-login">Autentifică-te</span></p>
            <div class="auth-divider"><span>sau</span></div>
            <button class="google-auth-btn">Continuă cu Google</button>
            <button class="close-auth">Închide</button>
        `;
        
        document.body.appendChild(registerContainer);
        
        // Activăm dialogul
        registerContainer.classList.add('active');
        
        // Verificare putere parolă
        const passwordInput = registerContainer.querySelector('input[type="password"]');
        const passwordStrength = registerContainer.querySelector('#password-strength');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = '';
            let color = '';
            
            if (password.length < 6) {
                strength = 'Slabă';
                color = 'red';
            } else if (password.length < 10) {
                strength = 'Medie';
                color = 'orange';
            } else {
                strength = 'Puternică';
                color = 'green';
            }
            
            passwordStrength.innerHTML = `Putere parolă: <span style="color: ${color}">${strength}</span>`;
        });
        
        // Adăugăm event listeners
        const form = registerContainer.querySelector('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = registerContainer.querySelector('input[type="text"]').value;
            const email = registerContainer.querySelector('input[type="email"]').value;
            const password = registerContainer.querySelector('input[type="password"]').value;
            
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Actualizăm profilul utilizatorului
                    return userCredential.user.updateProfile({
                        displayName: name
                    }).then(() => {
                        // Salvăm utilizatorul în Firestore
                        return db.collection('users').doc(userCredential.user.uid).set({
                            name: name,
                            email: email,
                            createdAt: new Date(),
                        });
                    });
                })
                .then(() => {
                    debug("Înregistrare reușită");
                    registerContainer.classList.remove('active');
                })
                .catch((error) => {
                    debug("Eroare la înregistrare: " + error.message);
                    alert("Eroare la înregistrare: " + error.message);
                });
        });
        
        // Toggle pentru autentificare
        registerContainer.querySelector('#show-login').addEventListener('click', function() {
            registerContainer.classList.remove('active');
            loginWithEmail();
        });
        
        // Buton Google
        registerContainer.querySelector('.google-auth-btn').addEventListener('click', function() {
            registerContainer.classList.remove('active');
            loginWithGoogle();
        });
        
        // Buton închidere
        registerContainer.querySelector('.close-auth').addEventListener('click', function() {
            registerContainer.classList.remove('active');
        });
    }
    
    /**
     * Autentificare cu Google
     */
    function loginWithGoogle() {
        debug("Autentificare cu Google");
        
        // Verificăm întâi dacă există controller-ul principal de autentificare
        if (window.AuthController && typeof window.AuthController.loginWithGoogle === 'function') {
            debug("Delegăm autentificarea cu Google către AuthController");
            window.AuthController.loginWithGoogle();
            return;
        }
        
        if (!initializeFirebase()) {
            debug("Firebase nu este disponibil pentru autentificare cu Google");
            fallbackGoogleLogin();
            return;
        }
        
        // Adăugăm un indicator vizual pentru a arăta că procesul este în curs
        const googleButton = document.querySelector('.google-button');
        if (googleButton) {
            const originalText = googleButton.innerHTML;
            googleButton.innerHTML = `
                <span class="icon">🔄</span>
                <span class="text">Se procesează...</span>
            `;
            
            // Resetăm butonul după 10 secunde în cazul unei erori
            setTimeout(() => {
                if (googleButton.querySelector('.text').textContent === 'Se procesează...') {
                    googleButton.innerHTML = originalText;
                }
            }, 10000);
        }
        
        // ÎMBUNĂTĂȚIM AUTENTIFICAREA CU GOOGLE - Folosim exclusiv popup pentru rezultate rapide
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                debug("Autentificare cu Google reușită");
                
                // Închide meniul profilului dacă este deschis
                closeProfileMenu();
                
                // Resetăm butonul
                if (googleButton) {
                    googleButton.innerHTML = `
                        <span class="icon">✅</span>
                        <span class="text">Autentificat!</span>
                    `;
                    setTimeout(() => {
                        googleButton.innerHTML = `
                            <span class="icon">🌐</span>
                            <span class="text">Continuă cu Google</span>
                        `;
                    }, 2000);
                }
                
                // Salvăm utilizatorul în Firestore dacă nu există deja
                const user = result.user;
                db.collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (!doc.exists) {
                            return db.collection('users').doc(user.uid).set({
                                name: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                createdAt: new Date(),
                            });
                        }
                    })
                    .catch((error) => {
                        debug("Eroare la salvarea utilizatorului în Firestore: " + error.message);
                    });
            })
            .catch((error) => {
                debug("Eroare la autentificare cu Google: " + error.message);
                
                // Resetăm butonul
                if (googleButton) {
                    googleButton.innerHTML = `
                        <span class="icon">❌</span>
                        <span class="text">Încercați din nou</span>
                    `;
                    setTimeout(() => {
                        googleButton.innerHTML = `
                            <span class="icon">🌐</span>
                            <span class="text">Continuă cu Google</span>
                        `;
                    }, 2000);
                }
                
                if (error.code !== 'auth/popup-closed-by-user') {
                    alert("Eroare la autentificare cu Google: " + error.message);
                }
            });
    }
    
    /**
     * Deconectare Firebase
     */
    function logout() {
        debug("Deconectare");
        if (!initializeFirebase()) {
            debug("Firebase nu este disponibil pentru deconectare");
            fallbackLogout();
            return;
        }
        
        auth.signOut()
            .then(() => {
                debug("Deconectare reușită");
                // Ștergem utilizatorul din localStorage pentru siguranță
                try {
                    localStorage.removeItem('user');
                } catch (e) {
                    debug("Eroare la ștergerea utilizatorului din localStorage: " + e.message);
                }
                
                // Actualizăm interfața
                updateProfileMenuState();
            })
            .catch((error) => {
                debug("Eroare la deconectare: " + error.message);
                alert("Eroare la deconectare: " + error.message);
            });
    }
    
    /**
     * Metode fallback pentru când Firebase nu este disponibil
     */
    function fallbackLogin() {
        debug("Folosesc metoda fallback pentru autentificare");
        
        // Verifică dacă există funcția window.showLogin pentru compatibilitate
        if (typeof window.showLogin === 'function') {
            window.showLogin();
            return;
        }
        
        // Altfel, afișăm o alertă
        alert("Vă rugăm să vă conectați pentru a continua.");
    }
    
    function fallbackRegister() {
        debug("Folosesc metoda fallback pentru înregistrare");
        
        // Verifică dacă există funcția window.toggleAuthForms pentru compatibilitate
        if (typeof window.toggleAuthForms === 'function') {
            window.toggleAuthForms();
            return;
        }
        
        // Altfel, folosim metoda de login fallback
        fallbackLogin();
    }
    
    function fallbackGoogleLogin() {
        debug("Folosesc metoda fallback pentru autentificare cu Google");
        
        // Verifică dacă există funcția window.loginWithGoogle pentru compatibilitate
        if (typeof window.loginWithGoogle === 'function') {
            window.loginWithGoogle();
            return;
        }
        
        // Altfel, afișăm o alertă
        alert("Autentificarea cu Google nu este disponibilă momentan.");
    }
    
    function fallbackLogout() {
        debug("Folosesc metoda fallback pentru deconectare");
        
        // Verifică dacă există funcția window.logout pentru compatibilitate
        if (typeof window.logout === 'function') {
            window.logout();
            return;
        }
        
        // Altfel, ștergem datele din localStorage
        try {
            localStorage.removeItem('user');
            alert("Deconectare reușită!");
            location.reload();
        } catch (e) {
            debug("Eroare la ștergerea utilizatorului din localStorage: " + e.message);
            alert("Eroare la deconectare. Reîncărcați pagina și încercați din nou.");
        }
    }
    
    /**
     * Inițializează butonul de profil pe mobil
     */
    function initialize() {
        debug('Inițializare controller buton utilizator mobil');
        
        // Creează imediat meniul pentru a fi pregătit
        createMobileProfileMenu();
        
        // Inițializează Firebase în background
        initializeFirebase();
        
        // Adăugăm efectul de pulsare pentru a atrage atenția utilizatorului
        const addPulseToProfileButton = () => {
            const profileButton = document.getElementById('profile-button-v7');
            if (profileButton) {
                // Adaugă animația de pulsare pentru a atrage atenția utilizatorului
                setTimeout(() => {
                    profileButton.classList.add('pulse-effect');
                    setTimeout(() => {
                        profileButton.classList.remove('pulse-effect');
                    }, 2000);
                }, 1000);
            }
        };
        
        // Adaugă animație de ripple la @keyframes dacă nu există deja
        if (!document.querySelector('style[data-id="profile-ripple-keyframes"]')) {
            const keyframesStyle = document.createElement('style');
            keyframesStyle.setAttribute('data-id', 'profile-ripple-keyframes');
            keyframesStyle.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0) translate(-50%, -50%);
                        opacity: 0.7;
                    }
                    100% {
                        transform: scale(20) translate(-50%, -50%);
                        opacity: 0;
                    }
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(107, 68, 35, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 8px rgba(107, 68, 35, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(107, 68, 35, 0);
                    }
                }
                
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .pulse-effect {
                    animation: pulse 2s infinite;
                }
            `;
            document.head.appendChild(keyframesStyle);
        }
        
        // Stiluri suplimentare pentru butonul de profil
        const profileButtonStyle = document.createElement('style');
        profileButtonStyle.textContent = `
            #profile-button-v7 {
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
                overflow: visible !important;
            }
            
            #profile-button-v7:active {
                transform: scale(0.9) !important;
            }
            
            #profile-button-v7.pulse-effect {
                animation: pulse 2s infinite !important;
            }
        `;
        document.head.appendChild(profileButtonStyle);
        
        // Caută butonul de profil din DOM și atașează event listener direct
        const profileButton = document.getElementById('profile-button-v7');
        if (profileButton) {
            debug("Am găsit butonul de profil, atașez listener direct");
            profileButton.addEventListener('click', handleProfileButtonClick);
            profileButton.setAttribute('data-handler-attached', 'true');
            
            // Adaugă pulsare inițială pentru a atrage atenția
            addPulseToProfileButton();
        } else {
            debug("Nu am găsit butonul de profil în DOM");
        }
        
        // Verificare periodică pentru a asigura funcționalitatea butonului
        setTimeout(() => {
            const profileButton = document.getElementById('profile-button-v7');
            if (profileButton && !profileButton.getAttribute('data-handler-attached')) {
                debug("Atașez listener cu întârziere");
                profileButton.addEventListener('click', handleProfileButtonClick);
                profileButton.setAttribute('data-handler-attached', 'true');
                
                // Adaugă pulsare
                addPulseToProfileButton();
            }
        }, 1000);
    }
    
    window.MobileUserButton.initialize = initialize;
    window.MobileUserButton.handleProfileButtonClick = handleProfileButtonClick;
    window.MobileUserButton.openProfileMenu = openProfileMenu;
    window.MobileUserButton.closeProfileMenu = closeProfileMenu;
    window.MobileUserButton.updateProfileMenuState = updateProfileMenuState;
    
    window.openMobileProfileMenu = openProfileMenu;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    window.addEventListener('load', initialize);
})();
