/**
 * Global type declarations for the project
 */

// Extend Window interface to include custom properties
interface Window {
  // Firebase properties
  firebase?: any;
  FIREBASE_INITIALIZED?: boolean;
  FIREBASE_CONFIG?: Record<string, any>;
  
  // React Router properties
  __reactRouterReactVersion?: string;
  __reactRouterIsSuppressed?: boolean;
  __reactRouterIsSilent?: boolean;
  __reactRouterDisableWarnings?: boolean;
  __ROUTER_WARNINGS_FIXED?: boolean;
  
  // Authentication controllers
  AuthController?: any;
  DesktopUserButton?: {
    handleProfileButtonClick: (event: MouseEvent) => void;
    showCart: () => void;
  };
  
  // Header initialization flags
  HEADER_L_INITIALIZED?: boolean;
  HEADER_M_INITIALIZED?: boolean;
  
  // Path fixer properties
  __pathFixerObserverActive?: boolean;
  __pathFixerLastRun?: number;
  __pathFixerStats?: {
    totalFixed: number;
    duplicatePreloadPathsFixed: number;
    imageSrcPathsFixed: number;
    backgroundImagePathsFixed: number;
    multiLevelPathsFixed: number;
    relativePathsFixed: number;
    lastRunTimestamp: number;
  };
  
  // Mobile utilities
  isMobileDevice?: boolean;
  mobileMenuInitialized?: boolean;
  mobileOptimizationsApplied?: boolean;
  
  // Console utilities
  originalConsole?: {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
  };
  consoleLogLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  createContextLogger?: (context: string, options?: any) => any;
}

// Declare custom events
interface CustomEventMap {
  'backgroundImageFound': CustomEvent<{ path: string }>;
  'firebaseInitialized': CustomEvent<void>;
  'authStateChanged': CustomEvent<{ user: any | null }>;
  'pathFixerComplete': CustomEvent<{ totalFixed: number, stats: Record<string, number> }>;
  'mobileMenuInitialized': CustomEvent<void>;
  'mobileOptimizationsApplied': CustomEvent<{ optimizations: string[] }>;
}

// Declare global DEBUG variable
declare const DEBUG: boolean;

// Declare module for importing image files
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}
