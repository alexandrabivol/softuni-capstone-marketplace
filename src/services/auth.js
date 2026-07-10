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

// 2. Account Login Service Handlers
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data.session ?? data.user;
}

// 3. Session-first check for route guards and post-login redirects
export async function getCurrentUser({ waitForSession = true, timeoutMs = 2000 } = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user;

    if (!waitForSession) return null;

    return await new Promise((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        subscription.unsubscribe();
        resolve(null);
      }, timeoutMs);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, nextSession) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        subscription.unsubscribe();
        resolve(nextSession?.user ?? null);
      });
    });
  } catch (error) {
    console.error("Auth helper error checking credentials:", error);
    return null;
  }
}

// 4. Clean Log-out Routine
export async function logoutUser() {
  await supabase.auth.signOut();
}