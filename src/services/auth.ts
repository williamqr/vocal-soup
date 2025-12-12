import { supabase } from "../lib/supabaseClient";

// src/services/auth.ts (or wherever your auth functions live)

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: Record<string, any> | undefined = undefined
) {
  // Pass metadata into the `options.data` field so it gets stored on auth.users.raw_user_meta_data
  const payload: any = {
    email,
    password,
  };

  if (metadata && Object.keys(metadata).length) {
    payload.options = { data: metadata };
  }

  const { data, error } = await supabase.auth.signUp(payload);

  if (error) throw error;
  return data; // contains user + session depending on email confirmation settings
}

export async function updateUserLanguage(lang: "en" | "zh") {
  // Supabase JS v2: updateUser accepts { data: {...} }
  const { data, error } = await supabase.auth.updateUser({
    data: { language: lang },
  });

  if (error) throw error;
  return data; // updated user info
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
