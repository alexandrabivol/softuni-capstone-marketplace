import { supabase } from './supabase.js';

// Absolute fail-safe: Retrieve current active authentication token session
export async function getCurrentUser() {
  try {
    // 1. Ask Supabase for the current active local session state
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && session.user) {
      return session.user;
    }

    // 2. Fallback: If network race conditions haven't established yet, look into the browser's storage
    const localSessionKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
    if (localSessionKey) {
      const localData = JSON.parse(localStorage.getItem(localSessionKey));
      if (localData && localData.user) {
        return localData.user;
      }
    }

    return null;
  } catch (error) {
    console.error("Auth helper error checking credentials:", error);
    return null;
  }
}

// Complete clean log-out routine
export async function logoutUser() {
  await supabase.auth.signOut();
  // Wipe any fallback items
  localStorage.removeItem('sb-mock-session');
}