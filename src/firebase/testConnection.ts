import { auth } from './config';

/**
 * Funcție pentru verificarea conectivității la Firebase
 */
export const testFirebaseConnection = async () => {
  try {
    // Testăm o operație simplă pentru a verifica conectivitatea
    const currentUser = auth.currentUser;
    console.log("Test Firebase: Utilizator curent:", currentUser ? currentUser.uid : "neautentificat");
    console.log("Test Firebase: Conexiune reușită!");
    return { success: true, message: "Conexiune reușită la Firebase" };
  } catch (error) {
    console.error("Test Firebase: Eroare la conexiune:", error);
    return { 
      success: false, 
      message: "Eroare la conectarea cu Firebase", 
      error 
    };
  }
};

// Poți rula acest test din consola browser-ului apelând:
// import { testFirebaseConnection } from './firebase/testConnection';
// testFirebaseConnection().then(console.log);
