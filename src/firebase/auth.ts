import { auth } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  RecaptchaVerifier,
  User,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';

// Autentificare cu email/parolă
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Înregistrare cu email/parolă
export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Autentificare cu telefon
export const initiatePhoneAuth = (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

// Autentificare cu Google - metoda actualizată pentru a încerca mai întâi popup, apoi redirect
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    provider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline',
      include_granted_scopes: 'true'
    });
    
    // Salvăm încercarea de autentificare în sessionStorage
    sessionStorage.setItem('auth_attempt', 'google');
    sessionStorage.setItem('auth_time', Date.now().toString());
    
    console.log("Încercare de autentificare cu Google (popup)...");
    try {
      // Încercăm mai întâi cu popup pentru o experiență mai bună
      return await signInWithPopup(auth, provider);
    } catch (popupError) {
      console.warn("Popup-ul a eșuat, se încearcă cu redirecționare:", popupError);
      return signInWithRedirect(auth, provider);
    }
  } catch (error) {
    console.error("Eroare la autentificarea cu Google:", error);
    throw error;
  }
};

// Funcție pentru a procesa rezultatul redirecționării
export const getGoogleRedirectResult = async () => {
  try {
    return await getRedirectResult(auth);
  } catch (error) {
    console.error("Eroare la procesarea rezultatului de redirecționare:", error);
    throw error;
  }
};

// Autentificare anonimă
export const loginAnonymously = () => {
  return signInAnonymously(auth);
};

// Deconectare
export const logout = () => {
  return signOut(auth);
};

// Obținerea utilizatorului curent
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
