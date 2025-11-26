
// Safe environment variable access
const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || fallback;
    }
  } catch (e) {
    // Ignore errors during env access
  }
  return fallback;
};

// Config defaults to "Not Ready" / Mock mode because Firebase modules are missing in this environment.
export const isFirebaseReady = false;

// Placeholder exports to satisfy imports in other files.
export const app = null;
export const db = null;
export const auth = null;
