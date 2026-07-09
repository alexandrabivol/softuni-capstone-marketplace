import { supabase } from './supabase';

// 1. Sign Up a New User
export async function registerUser(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  if (error) throw error;
  return data;
}

// 2. Log In an Existing User
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

// 3. Log Out the Current User
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 4. Get Current Logged In User Session
export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session?.user || null;
}