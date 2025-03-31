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

// Funcție pentru a grupa mesaje de log sub un anumit context
export function createContextLogger(context, options = {}) {
  const defaultOptions = {
    showTimestamp: true,
    enableColors: true,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    silent: false
  };
  
  const settings = { ...defaultOptions, ...options };
  
  const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  const selectedLogLevel = logLevels[settings.logLevel] || 1;
  
  const colors = {
    debug: '\x1b[90m', // Grey
    info: '\x1b[36m',  // Cyan
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m'   // Reset
  };
  
  function getTimestamp() {
    if (!settings.showTimestamp) return '';
    
    const now = new Date();
    return `[${now.toISOString()}] `;
  }
  
  function applyColor(level, message) {
    if (!settings.enableColors) return message;
    
    return `${colors[level]}${message}${colors.reset}`;
  }
  
  function shouldLog(level) {
    if (settings.silent) return false;
    return logLevels[level] >= selectedLogLevel;
  }
  
  return {
    debug: function(...args) {
      if (!shouldLog('debug')) return;
      
      const prefix = `${getTimestamp()}[${context}][DEBUG] `;
      const coloredPrefix = applyColor('debug', prefix);
      originalConsole.debug(coloredPrefix, ...args);
    },
    
    info: function(...args) {
      if (!shouldLog('info')) return;
      
      const prefix = `${getTimestamp()}[${context}][INFO] `;
      const coloredPrefix = applyColor('info', prefix);
      originalConsole.info(coloredPrefix, ...args);
    },
    
    warn: function(...args) {
      if (!shouldLog('warn')) return;
      
      const prefix = `${getTimestamp()}[${context}][WARN] `;
      const coloredPrefix = applyColor('warn', prefix);
      originalConsole.warn(coloredPrefix, ...args);
    },
    
    error: function(...args) {
      if (!shouldLog('error')) return;
      
      const prefix = `${getTimestamp()}[${context}][ERROR] `;
      const coloredPrefix = applyColor('error', prefix);
      originalConsole.error(coloredPrefix, ...args);
    },
    
    group: function(title) {
      if (settings.silent) return;
      
      const groupTitle = `${getTimestamp()}[${context}] ${title}`;
      originalConsole.group(groupTitle);
    },
    
    groupEnd: function() {
      if (settings.silent) return;
      
      originalConsole.groupEnd();
    },
    
    // Utility method to create a child logger with the same settings
    createChildLogger: function(childContext, childOptions = {}) {
      return createContextLogger(`${context}:${childContext}`, {
        ...settings,
        ...childOptions
      });
    }
  };
}

// Example usage:
// const logger = createContextLogger('App');
// logger.info('Application started');
// 
// const apiLogger = logger.createChildLogger('API');
// apiLogger.warn('API rate limit exceeded');

export default {
  silenceConsoleFor,
  createContextLogger
};
