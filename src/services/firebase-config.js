/**
 * Configurație Firebase - versiunea compat
 */

// Folosim obiectul Firebase global în loc de ES6 imports
(function() {
  // Flag pentru debugging
  const DEBUG = true;
  function debug(message) {
    if (DEBUG) console.log("FirebaseConfig: " + message);
  }
  
  debug("Încercare inițializare Firebase");
  
  // Configurația Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyABtSj1pfyU6lbwoLt55f_2F5TgfhSBK6g",
    authDomain: "fir-web-c1a1d.firebaseapp.com",
    projectId: "fir-web-c1a1d",
    storageBucket: "fir-web-c1a1d.firebasestorage.app",
    messagingSenderId: "244211979994",
    appId: "1:244211979994:web:fa82367b2460b6f96ef7e3",
    measurementId: "G-TM9NHZXPLF"
  };

  // Preventie pentru multiple inițializări
  window.FIREBASE_INITIALIZED = window.FIREBASE_INITIALIZED || false;
  
  // Inițializează Firebase doar dacă nu există deja
  if (!window.FIREBASE_INITIALIZED && typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        debug("Inițializare Firebase nou");
        firebase.initializeApp(firebaseConfig);
        
        // Inițializăm Analytics dacă e disponibil
        if (firebase.analytics) {
          firebase.analytics();
          debug("Firebase Analytics inițializat");
        }
        
        // IMPORTANT: Verifică rezultatul redirecționării după inițializare
        const auth = firebase.auth();
        auth.getRedirectResult().then((result) => {
          if (result.user) {
            debug("Redirecționare autentificare finalizată cu succes pentru: " + result.user.email);
          }
        }).catch((error) => {
          debug("Eroare la verificarea rezultatului redirecționării: " + error.message);
          if (error.code !== 'auth/popup-closed-by-user') {
            console.error("Eroare redirect:", error);
          }
        });
        
        // Setăm flag-ul global
        window.FIREBASE_INITIALIZED = true;
        
        // Expunem configurația pentru alte scripturi
        window.FIREBASE_CONFIG = firebaseConfig;
        
        debug('Firebase inițializat cu succes');
      } else {
        debug('Firebase deja inițializat, se refolosește instanța existentă');
        window.FIREBASE_INITIALIZED = true;
      }
    } catch (error) {
      debug('Eroare la inițializarea Firebase: ' + error.message);
      console.error('Eroare Firebase:', error);
    }
  } else if (window.FIREBASE_INITIALIZED) {
    debug('Firebase deja inițializat anterior');
  } else {
    debug('Firebase SDK nu este disponibil. Asigurați-vă că scripturile Firebase sunt încărcate înainte de acest script.');
  }
  
  // Adăugăm un listener pentru a detecta când Firebase devine disponibil
  if (!window.FIREBASE_INITIALIZED && typeof firebase === 'undefined') {
    debug('Se așteaptă încărcarea SDK-ului Firebase...');
    
    // Verifică periodic dacă Firebase a devenit disponibil
    const checkInterval = setInterval(() => {
      if (typeof firebase !== 'undefined') {
        debug('Firebase SDK detectat, se inițializează...');
        clearInterval(checkInterval);
        
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
          
          if (firebase.analytics) {
            firebase.analytics();
          }
          
          window.FIREBASE_INITIALIZED = true;
          window.FIREBASE_CONFIG = firebaseConfig;
          
          debug('Firebase inițializat cu succes după așteptare');
          
          // Declanșează un eveniment pentru a notifica alte scripturi
          document.dispatchEvent(new CustomEvent('firebaseInitialized'));
        }
      }
    }, 200);
    
    // Oprim verificarea după 10 secunde pentru a evita bucle infinite
    setTimeout(() => {
      if (!window.FIREBASE_INITIALIZED) {
        debug('Timeout la așteptarea Firebase SDK');
        clearInterval(checkInterval);
      }
    }, 10000);
  }
})();
