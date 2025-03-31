/**
 * Controller unificat pentru autentificare, compatibil cu Firebase Compat
 */

(function() {
    // Define DEBUG variable to enable console logging during development
    const DEBUG = process.env.NODE_ENV === 'development' || false;
    
    function debug(message) {
        if (DEBUG) console.log("Auth: " + message);
    }
    
    debug("Script de autentificare inițiat");
    
    // Firebase config - asigură-te că aceasta este aceeași configurație peste tot
    const firebaseConfig = {
        apiKey: "AIzaSyABtSj1pfyU6lbwoLt55f_2F5TgfhSBK6g",
        authDomain: "fir-web-c1a1d.firebaseapp.com",
        projectId: "fir-web-c1a1d",
        storageBucket: "fir-web-c1a1d.firebasestorage.app",
        messagingSenderId: "244211979994",
        appId: "1:244211979994:web:fa82367b2460b6f96ef7e3",
        measurementId: "G-TM9NHZXPLF"
    };
    
    // Variabile pentru Firebase
    let auth = null;
    let db = null;
    let googleProvider = null;
    
    // Inițializează Firebase dacă nu este deja inițializat
    function initializeAuth() {
        debug("Inițializare Firebase Auth");
        
        // Verifică dacă Firebase este deja disponibil
        if (typeof firebase === 'undefined') {
            debug("Firebase SDK nu este disponibil. Scripturile necesare trebuie incluse înainte de auth.js");
            return false;
        }
        
        try {
            // Inițializează Firebase dacă nu există deja
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                debug("Firebase App inițializat cu succes");
            } else {
                debug("Firebase App deja inițializat, refolosesc instanța existentă");
            }
            
            // Obține serviciile necesare
            auth = firebase.auth();
            
            // Verificare și inițializare Firestore cu fallback
            try {
                if (typeof firebase.firestore === 'function') {
                    db = firebase.firestore();
                    debug("Firestore inițializat cu succes");
                } else {
                    debug("Firestore nu este disponibil, se folosește stocare locală");
                    // Creează un mock pentru db
                    db = createFirestoreMock();
                }
            } catch (firestoreError) {
                debug("Eroare la inițializarea Firestore: " + firestoreError.message);
                // Creează un mock pentru db
                db = createFirestoreMock();
            }
            
            googleProvider = new firebase.auth.GoogleAuthProvider();
            
            // Configurare provider Google
            googleProvider.setCustomParameters({
                prompt: 'select_account'  // Forțează selectarea contului la fiecare login
            });
            
            // Setează listener pentru schimbări de autentificare
            auth.onAuthStateChanged(handleAuthStateChanged);
            
            debug("Firebase Auth inițializat cu succes");
            return true;
        } catch (error) {
            debug("Eroare la inițializarea Firebase: " + error.message);
            return false;
        }
    }
    
    // Crează un mock pentru Firestore pentru a evita erorile
    function createFirestoreMock() {
        return {
            collection: function(name) {
                return {
                    doc: function(id) {
                        return {
                            set: function() {
                                return Promise.resolve();
                            },
                            get: function() {
                                return Promise.resolve({
                                    exists: false,
                                    data: function() { return null; }
                                });
                            }
                        };
                    }
                };
            },
            FieldValue: {
                serverTimestamp: function() { return new Date().toISOString(); }
            }
        };
    }
    
    // Gestionează schimbările de autentificare
    function handleAuthStateChanged(user) {
        debug("Stare autentificare schimbată: " + (user ? "Utilizator autentificat" : "Neautentificat"));
        
        if (user) {
            // Salvează utilizatorul în localStorage pentru compatibilitate
            const userData = {
                uid: user.uid,
                name: user.displayName || 'Utilizator',
                email: user.email || '',
                photoURL: user.photoURL || '',
                isFirebaseUser: true
            };
            
            try {
                localStorage.setItem('user', JSON.stringify(userData));
                debug("Utilizator salvat în localStorage");
            } catch (e) {
                debug("Eroare la salvarea utilizatorului în localStorage: " + e.message);
            }
            
            // Salvează utilizatorul în Firestore
            try {
                db.collection('users').doc(user.uid).set({
                    name: user.displayName || 'Utilizator',
                    email: user.email || '',
                    photoURL: user.photoURL || '',
                    lastLogin: typeof db.FieldValue.serverTimestamp === 'function' ? 
                              db.FieldValue.serverTimestamp() : 
                              new Date().toISOString()
                }, { merge: true })
                .then(() => {
                    debug("Utilizator actualizat în Firestore");
                })
                .catch((error) => {
                    debug("Eroare la actualizarea utilizatorului în Firestore: " + error.message);
                });
            } catch (dbError) {
                debug("Eroare la salvarea în db (non-critică): " + dbError.message);
            }
            
            // Actualizează UI-ul
            updateAuthUI(user);
        } else {
            // Elimină utilizatorul din localStorage
            try {
                localStorage.removeItem('user');
                debug("Utilizator eliminat din localStorage");
            } catch (e) {
                debug("Eroare la ștergerea utilizatorului din localStorage: " + e.message);
            }
            
            // Actualizează UI-ul
            updateAuthUI(null);
        }
    }
    
    // Actualizează interfața în funcție de starea de autentificare
    function updateAuthUI(user) {
        debug("Actualizare UI pentru " + (user ? user.email : "utilizator neautentificat"));
        
        // Actualizare elemente UI comune
        const profileEmail = document.getElementById('profile-email');
        const profileMenu = document.getElementById('profile-menu');
        const authOptions = document.querySelector('.auth-options');
        const authButtons = document.querySelector('.auth-buttons');
        
        if (profileEmail) profileEmail.innerText = user ? user.email : '';
        
        if (profileMenu) {
            profileMenu.style.display = user ? 'block' : 'none';
        }
        
        if (authOptions) {
            authOptions.style.display = user ? 'none' : 'flex';
        }
        
        if (authButtons) {
            authButtons.style.display = user ? 'none' : 'flex';
        }
        
        // Închide dialogurile de autentificare dacă sunt deschise
        const loginContainer = document.getElementById('login-container');
        const registerContainer = document.getElementById('register-container');
        
        if (loginContainer) loginContainer.classList.remove('active');
        if (registerContainer) registerContainer.classList.remove('active');
        
        // Eveniment custom pentru a notifica alte scripturi
        const event = new CustomEvent('authStateChanged', { detail: { user } });
        document.dispatchEvent(event);
    }
    
    // Autentificare cu email și parolă
    function login() {
        debug("Încercare de autentificare cu email și parolă");
        
        if (!initializeAuth()) {
            debug("Auth nu este inițializat");
            return;
        }
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Introduceți email și parolă!');
            return;
        }
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                debug("Autentificare reușită");
                alert('Autentificare reușită!');
            })
            .catch((error) => {
                debug("Eroare la autentificare: " + error.message);
                alert('Eroare la autentificare: ' + error.message);
            });
    }
    
    // Înregistrare cu email și parolă
    function register() {
        debug("Încercare de înregistrare cu email și parolă");
        
        if (!initializeAuth()) {
            debug("Auth nu este inițializat");
            return;
        }
        
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const name = document.getElementById('register-name')?.value || '';
        
        if (!email || !password) {
            alert('Introduceți email și parolă!');
            return;
        }
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Actualizează profilul cu numele furnizat
                return user.updateProfile({
                    displayName: name
                }).then(() => {
                    debug("Profil actualizat");
                    try {
                        // Try to update Firestore, but don't fail if it doesn't work
                        return db.collection('users').doc(user.uid).set({
                            name: name,
                            email: email,
                            createdAt: typeof db.FieldValue.serverTimestamp === 'function' ? 
                                      db.FieldValue.serverTimestamp() : 
                                      new Date().toISOString()
                        });
                    } catch (dbError) {
                        debug("Eroare la salvarea în db (non-critică): " + dbError.message);
                        return Promise.resolve(); // Continue anyway
                    }
                });
            })
            .then(() => {
                debug("Înregistrare reușită");
                alert('Înregistrare reușită!');
                // Închide dialogul de înregistrare
                toggleAuthForms();
            })
            .catch((error) => {
                debug("Eroare la înregistrare: " + error.message);
                alert('Eroare la înregistrare: ' + error.message);
            });
    }
    
    // Autentificare cu Google
    function loginWithGoogle() {
        debug("Încercare de autentificare cu Google");
        
        if (!initializeAuth()) {
            debug("Auth nu este inițializat");
            alert("Eroare: Firebase nu este inițializat corect. Reîncărcați pagina și încercați din nou.");
            return;
        }
        
        // Adăugăm un indicator vizual pentru a arăta că procesul este în curs
        const googleButtons = document.querySelectorAll('#google-auth, [onclick*="loginWithGoogle"]');
        googleButtons.forEach(button => {
            const originalText = button.innerHTML;
            button.innerHTML = 'Se procesează...';
            button.disabled = true;
            
            // Resetăm butonul după 10 secunde în cazul unei erori
            setTimeout(() => {
                if (button.innerHTML === 'Se procesează...') {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }
            }, 10000);
        });
        
        // SCHIMBARE IMPORTANTĂ: Folosim popup în loc de redirect pentru o experiență mai bună
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                debug("Autentificare cu Google reușită");
                
                // Resetăm butonul
                googleButtons.forEach(button => {
                    button.innerHTML = 'Autentificat!';
                    setTimeout(() => {
                        button.innerHTML = 'Autentificare cu Google';
                        button.disabled = false;
                    }, 2000);
                });
                
                // Nu e necesar alert - UI-ul se va actualiza automat
                // datorită handler-ului onAuthStateChanged
            })
            .catch((error) => {
                debug("Eroare la autentificare cu Google: " + error.message);
                
                // Resetăm butonul
                googleButtons.forEach(button => {
                    button.innerHTML = 'Încercați din nou';
                    button.disabled = false;
                });
                
                // Nu afișa eroare când utilizatorul închide popup-ul
                if (error.code !== 'auth/popup-closed-by-user') {
                    alert('Eroare la autentificare cu Google: ' + error.message);
                }
            });
    }
    
    // Deconectare
    function logout() {
        debug("Încercare de deconectare");
        
        if (!initializeAuth()) {
            debug("Auth nu este inițializat");
            
            // Curăță localStorage pentru a asigura deconectarea
            localStorage.removeItem('user');
            location.reload();
            return;
        }
        
        auth.signOut()
            .then(() => {
                debug("Deconectare reușită");
                alert('Deconectare reușită!');
            })
            .catch((error) => {
                debug("Eroare la deconectare: " + error.message);
                alert('Eroare la deconectare: ' + error.message);
            });
    }
    
    // Toggle între formularele de autentificare și înregistrare
    function toggleAuthForms() {
        const loginContainer = document.getElementById('login-container');
        const registerContainer = document.getElementById('register-container');
        
        if (loginContainer && registerContainer) {
            loginContainer.classList.toggle('active');
            registerContainer.classList.toggle('active');
        }
    }
    
    // Afișează dialogul de autentificare
    function showLogin() {
        const loginContainer = document.getElementById('login-container');
        const registerContainer = document.getElementById('register-container');
        const profileDetails = document.querySelector('.profile-details');
        
        if (loginContainer) {
            loginContainer.classList.add('active');
        }
        
        if (registerContainer) {
            registerContainer.classList.remove('active');
        }
        
        if (profileDetails) {
            profileDetails.style.display = 'none';
        }
    }
    
    // Inițializează autentificarea și ascultă evenimentele DOM
    function initialize() {
        debug("Inițializare controller autentificare");
        
        // Inițializează Firebase Auth
        if (!initializeAuth()) {
            debug("Inițializare eșuată, va reîncerca după încărcarea completă a paginii");
        } else {
            // Verifică dacă există un rezultat de redirecționare pentru autentificare
            auth.getRedirectResult().then((result) => {
                if (result.user) {
                    debug("Utilizator autentificat după redirecționare: " + result.user.email);
                }
            }).catch((error) => {
                debug("Eroare la procesarea rezultatului redirecționării: " + error.message);
            });
        }
        
        // IMPORTANT: Eliminăm event listener-ul general pentru a evita conflictele
        // și atașăm event listener-uri specifice pentru fiecare buton
        
        // Autentificare cu Google
        const googleAuthButtons = document.querySelectorAll('#google-auth, [onclick*="loginWithGoogle"]');
        googleAuthButtons.forEach(button => {
            // Eliminăm onclick atributul pentru a evita duplicarea
            if (button.getAttribute('onclick')) {
                button.removeAttribute('onclick');
            }
            
            // Adăugăm listener doar dacă nu are deja unul
            if (!button.dataset.authListenerAttached) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    debug("Click pe buton Google Auth");
                    loginWithGoogle();
                });
                button.dataset.authListenerAttached = 'true';
            }
        });
        
        // Login
        const loginButtons = document.querySelectorAll('[onclick="login()"]');
        loginButtons.forEach(button => {
            if (button.getAttribute('onclick')) {
                button.removeAttribute('onclick');
            }
            
            if (!button.dataset.authListenerAttached) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    debug("Click pe buton Login");
                    login();
                });
                button.dataset.authListenerAttached = 'true';
            }
        });
        
        // Register
        const registerButtons = document.querySelectorAll('[onclick="register()"]');
        registerButtons.forEach(button => {
            if (button.getAttribute('onclick')) {
                button.removeAttribute('onclick');
            }
            
            if (!button.dataset.authListenerAttached) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    debug("Click pe buton Register");
                    register();
                });
                button.dataset.authListenerAttached = 'true';
            }
        });
        
        // Logout
        const logoutButtons = document.querySelectorAll('[onclick="logout()"]');
        logoutButtons.forEach(button => {
            if (button.getAttribute('onclick')) {
                button.removeAttribute('onclick');
            }
            
            if (!button.dataset.authListenerAttached) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    debug("Click pe buton Logout");
                    logout();
                });
                button.dataset.authListenerAttached = 'true';
            }
        });
        
        // Show Login
        const showLoginButtons = document.querySelectorAll('[onclick="showLogin()"]');
        showLoginButtons.forEach(button => {
            if (button.getAttribute('onclick')) {
                button.removeAttribute('onclick');
            }
            
            if (!button.dataset.authListenerAttached) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    debug("Click pe buton Show Login");
                    showLogin();
                });
                button.dataset.authListenerAttached = 'true';
            }
        });
        
        // Toggle Auth Forms
        const toggleAuthFormsButtons = document.querySelectorAll('[onclick="toggleAuthForms()"]');
        toggleAuthFormsButtons.forEach(button => {
            if (button.getAttribute('onclick')) {
                button.removeAttribute('onclick');
            }
            
            if (!button.dataset.authListenerAttached) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    debug("Click pe buton Toggle Auth Forms");
                    toggleAuthForms();
                });
                button.dataset.authListenerAttached = 'true';
            }
        });
        
        // Formular login
        const loginForm = document.getElementById('login-form');
        if (loginForm && !loginForm.dataset.authListenerAttached) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                debug("Submit formular login");
                login();
            });
            loginForm.dataset.authListenerAttached = 'true';
        }
        
        // Formular înregistrare
        const registerForm = document.getElementById('register-form');
        if (registerForm && !registerForm.dataset.authListenerAttached) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                debug("Submit formular register");
                register();
            });
            registerForm.dataset.authListenerAttached = 'true';
        }
        
        // Îmbunătățim inputurile din formularele de autentificare
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.autocomplete = 'email';
        });
        
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.autocomplete = 'current-password';
        });
    }
    
    // Verificare periodică pentru prevenirea problemelor
    function monitorAuthComponents() {
        setInterval(() => {
            const currentUser = auth ? auth.currentUser : null;
            
            // Verificăm dacă UI-ul reflectă corect starea de autentificare
            if (currentUser) {
                const profileEmail = document.getElementById('profile-email');
                if (profileEmail && profileEmail.innerText !== currentUser.email) {
                    debug("Inconsistență detectată: email profil nu este actualizat");
                    updateAuthUI(currentUser);
                }
            }
            
            // Verificăm dacă avem conflicte de eveniment
            const googleButtons = document.querySelectorAll('#google-auth');
            googleButtons.forEach(button => {
                if (button.getAttribute('onclick')) {
                    debug("Atribut onclick detectat pe buton Google care ar trebui să folosească event listener");
                    button.removeAttribute('onclick');
                    
                    if (!button.dataset.authListenerAttached) {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            loginWithGoogle();
                        });
                        button.dataset.authListenerAttached = 'true';
                    }
                }
            });
        }, 5000);
    }
    
    // Expune funcțiile în obiectul global
    window.AuthController = {
        login: login,
        register: register,
        loginWithGoogle: loginWithGoogle,
        logout: logout,
        showLogin: showLogin,
        toggleAuthForms: toggleAuthForms
    };
    
    // Înlocuiește funcțiile vechi cu referințe către controller
    window.login = login;
    window.register = register;
    window.loginWithGoogle = loginWithGoogle;
    window.logout = logout;
    window.showLogin = showLogin;
    window.toggleAuthForms = toggleAuthForms;
    
    // Inițializează la încărcarea DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Inițializează din nou la încărcarea completă a paginii și pornește monitorizarea
    window.addEventListener('load', function() {
        initialize();
        
        // Verifică starea autentificării după încărcarea completă
        if (auth) {
            const user = auth.currentUser;
            updateAuthUI(user);
        } else {
            // Încearcă să inițializeze din nou
            initializeAuth();
        }
        
        // Pornește monitorizarea componentelor de autentificare
        monitorAuthComponents();
    });
})();
