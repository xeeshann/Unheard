import { Client, Account, Databases, Storage, Avatars, ID } from 'appwrite';

// Environment variables - in production, these should be loaded from .env files
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '6810b8690030386f5a32';
const APPWRITE_DATABASE_ID = '6810bc6a00138f45507c';
const APPWRITE_CONFESSION_COLLECTION_ID = '6810bc91003725dfe660';
const APPWRITE_COMMENT_COLLECTION_ID = '6810bca3001da74a9399';
const APPWRITE_REACTION_COLLECTION_ID = '6810bcb2000152013543';

// Initialize the Appwrite client
export const client = new Client();
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

// PERSISTENT SESSION KEYS
const DEVICE_ID_KEY = 'unheard_anonymous_id';
const SESSION_ID_KEY = 'unheard_session_id';

// Create a reliable user identity that preserves anonymity
export const getAnonymousId = () => {
  let anonymousId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!anonymousId) {
    anonymousId = ID.unique();
    localStorage.setItem(DEVICE_ID_KEY, anonymousId);
  }
  
  return anonymousId;
};

// Session management
let sessionPromise: Promise<any> | null = null;

/**
 * Enhanced session management that preserves sessions across refreshes
 * This uses localStorage to remember session IDs and recover them
 */
export const getOrCreateSession = async (): Promise<any> => {
  // Use promise caching to prevent multiple simultaneous auth attempts
  if (sessionPromise) {
    return sessionPromise;
  }
  
  sessionPromise = (async () => {
    try {
      // First, try to get the current session directly
      try {
        const session = await account.get();
        console.log("Using active session");
        return session;
      } catch (activeSessionErr) {
        // No active session, try to recover from localStorage
        const savedSessionId = localStorage.getItem(SESSION_ID_KEY);
        
        if (savedSessionId) {
          try {
            // Try to get the session using the stored ID
            console.log("Attempting to recover session from storage");
            const session = await account.getSession(savedSessionId);
            console.log("Successfully recovered session");
            return session;
          } catch (recoveryErr) {
            // If recovery fails, remove the invalid session ID
            console.log("Session recovery failed, creating new session");
            localStorage.removeItem(SESSION_ID_KEY);
          }
        }
        
        // Create anonymous session if recovery fails or no saved session
        console.log("Creating new anonymous session...");
        const anonSession = await account.createAnonymousSession();
        console.log("Anonymous session created:", anonSession.$id);
        
        // Save the new session ID for future recovery
        localStorage.setItem(SESSION_ID_KEY, anonSession.$id);
        
        return anonSession;
      }
    } catch (sessionErr) {
      console.error("Failed to create anonymous session:", sessionErr);
      throw sessionErr;
    } finally {
      // Reset the session promise after a delay to allow for retry if needed
      setTimeout(() => {
        sessionPromise = null;
      }, 30000);
    }
  })();
  
  return sessionPromise;
};

// Initialize session on app load without blocking rendering
getOrCreateSession().catch(err => {
  console.error("Initial session creation failed:", err);
});

// Export collection IDs for easy access
export { 
  APPWRITE_DATABASE_ID,
  APPWRITE_CONFESSION_COLLECTION_ID,
  APPWRITE_COMMENT_COLLECTION_ID,
  APPWRITE_REACTION_COLLECTION_ID
};