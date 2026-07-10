import { supabase } from './supabase.js';

// 1. Account Registration Service Handlers
export async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data.user;
}

// 2. Account Login Service Handlers (If your login page needs it)
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data.user;
}

// 3. Failsafe Session Check for Protected Dashboards
export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && session.user) {
      return session.user;
    }

    // Fallback: Look into browser local storage cache to clear dashboard race conditions
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

// 4. Clean Log-out Routine
export async function logoutUser() {
  await supabase.auth.signOut();
}