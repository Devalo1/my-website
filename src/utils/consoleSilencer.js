/**
 * Utilitar pentru suprimarea mesajelor console în producție
 * și organizarea mesajelor în dezvoltare
 */

// Determină dacă suntem în producție
const isProduction = process.env.NODE_ENV === 'production' || 
                     window.location.hostname !== 'localhost';

// Păstrează referințele originale ale funcțiilor console
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug
};

// Prefix pentru mesajele din console
const PREFIX = {
  DEBUG: '[DEBUG] ',
  INFO: '[INFO] ',
  WARN: '[WARN] ',
  ERROR: '[ERROR] ',
  AUTH: '[AUTH] ',
  ROUTER: '[ROUTER] ',
  FIREBASE: '[FIREBASE] ',
  ASSETS: '[ASSETS] '
};

// Funcție pentru a detecta originea mesajului și adăuga prefixul potrivit
function addPrefixBySource(message) {
  if (typeof message !== 'string') return message;
  
  if (message.includes('Firebase') || message.includes('firestore')) {
    return PREFIX.FIREBASE + message;
  } else if (message.includes('router') || message.includes('Router')) {
    return PREFIX.ROUTER + message;
  } else if (message.includes('auth') || message.includes('Auth')) {
    return PREFIX.AUTH + message;
  } else if (message.includes('image') || message.includes('Image') || message.includes('background')) {
    return PREFIX.ASSETS + message;
  }
  
  return message;
}

// Suprascrie funcțiile console în producție
if (isProduction) {
  // În producție, suprimă majoritatea mesajelor, dar păstrează erorile
  console.log = function() {};
  console.info = function() {};
  console.debug = function() {};
  console.warn = function(...args) {
    // Păstrează avertismentele critice
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('critical') || args[0].includes('security'))) {
      originalConsole.warn.apply(console, args);
    }
  };
  
  // Păstrează doar erorile
  console.error = originalConsole.error;
} else {
  // În dezvoltare, organizează mesajele
  console.log = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      args[0] = addPrefixBySource(args[0]);
    }
    originalConsole.log.apply(console, args);
  };
  
  console.info = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      args[0] = PREFIX.INFO + args[0];
    }
    originalConsole.info.apply(console, args);
  };
  
  console.warn = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      args[0] = PREFIX.WARN + args[0];
    }
    originalConsole.warn.apply(console, args);
  };
  
  console.error = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      args[0] = PREFIX.ERROR + args[0];
    }
    originalConsole.error.apply(console, args);
  };
  
  console.debug = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      args[0] = PREFIX.DEBUG + args[0];
    }
    originalConsole.debug.apply(console, args);
  };
}

// Funcție pentru a grupa mesaje de log sub un anumit context
console.groupByContext = function(contextName, callback) {
  console.groupCollapsed(`[${contextName}]`);
  callback();
  console.groupEnd();
};

// Adaugă o funcție pentru a înregistra mesaje doar în dezvoltare
console.devOnly = function(...args) {
  if (!isProduction) {
    originalConsole.log.apply(console, args);
  }
};

// Utilitar pentru a supprima toate mesajele console pentru o anumită perioadă
export function silenceConsoleFor(milliseconds) {
  // Salvează funcțiile originale
  const savedConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Suprascrie toate funcțiile cu funcții goale
  console.log = function() {};
  console.warn = function() {};
  console.error = function() {};
  console.info = function() {};
  console.debug = function() {};
  
  // Restaurează funcțiile după perioada specificată
  setTimeout(() => {
    console.log = savedConsole.log;
    console.warn = savedConsole.warn;
    console.error = savedConsole.error;
    console.info = savedConsole.info;
    console.debug = savedConsole.debug;
    console.log('[CONSOLE] Messaging restored');
  }, milliseconds);
}

export default {
  silenceConsoleFor
};
