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
}

// Declare custom events
interface CustomEventMap {
  'backgroundImageFound': CustomEvent<{ path: string }>;
  'firebaseInitialized': CustomEvent<void>;
  'authStateChanged': CustomEvent<{ user: any | null }>;
}

declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (ev: CustomEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): boolean;
  }
}

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
