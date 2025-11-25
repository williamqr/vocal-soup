import { supabase } from "../lib/supabaseClient";

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data; // contains user + session (depending on email confirmation settings)
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data; // { user, session }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
