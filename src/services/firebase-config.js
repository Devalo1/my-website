/**
 * Configurație Firebase - versiunea compat
 */

// Folosim obiectul Firebase global în loc de ES6 imports
(function() {
  const DEBUG = typeof window.DEBUG !== 'undefined' ? window.DEBUG : false;

  function debug(message) {
    if (DEBUG) console.log("FirebaseConfig: " + message);
  }

  debug("Încercare inițializare Firebase");

  // Verifică dacă Firebase este deja inițializat
  if (window.FIREBASE_INITIALIZED) {
    debug("Firebase deja inițializat, refolosim instanța existentă");
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyDEMOKEY123456789",
    authDomain: "lupul-si-corbul.firebaseapp.com",
    projectId: "lupul-si-corbul",
    storageBucket: "lupul-si-corbul.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
  };

  try {
    if (typeof firebase !== 'undefined') {
      debug("Inițializare Firebase nou");

      const app = firebase.initializeApp(firebaseConfig);
      window.FIREBASE_APP = app;
      window.FIREBASE_CONFIG = firebaseConfig;
      window.FIREBASE_INITIALIZED = true;

      debug("Firebase inițializat cu succes");

      const event = new CustomEvent('firebaseInitialized');
      document.dispatchEvent(event);

      if (firebase.auth) {
        debug("Inițializare Firebase Auth");
        window.FIREBASE_AUTH = firebase.auth();
      }

      if (firebase.firestore) {
        debug("Inițializare Firebase Firestore");
        window.FIREBASE_FIRESTORE = firebase.firestore();
      }
    } else {
      debug("Firebase SDK nu este disponibil, va fi utilizat un mock");
      window.firebase = {
        auth: () => ({
          onAuthStateChanged: (callback) => callback(null),
          signInWithEmailAndPassword: () => Promise.resolve(null),
          signOut: () => Promise.resolve(null),
          currentUser: null
        }),
        firestore: () => ({
          collection: () => ({
            add: () => Promise.resolve({}),
            get: () => Promise.resolve({ docs: [] })
          })
        })
      };

      window.FIREBASE_INITIALIZED = true;
      window.FIREBASE_CONFIG = firebaseConfig;

      debug("Mock Firebase inițializat cu succes");
    }
  } catch (error) {
    debug("Eroare la inițializarea Firebase: " + error.message);
    window.FIREBASE_INITIALIZED = true;
  }
})();
