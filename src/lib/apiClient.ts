// src/lib/apiClient.ts
import { supabase } from "../lib/supabaseClient";

// In dev: use localhost for iOS simulator, or your LAN IP for a real device
const API_BASE = "https://backend-9hz3.onrender.com";

/**
 * Helper that returns Authorization header for current Supabase session.
 * Throws if there's no active session.
 */
async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No active Supabase session");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

/**
 * fetchMe:
 * - Tries to fetch profile from your backend `/me` endpoint (preferred).
 * - If backend /me omits language (or the backend request fails), falls back
 *   to the Supabase user metadata (user.user_metadata.language).
 *
 * Returned value shape depends on your backend; this function will augment
 * it with `language` when possible.
 */
export async function fetchMe() {
  // 1. Get session (contains user + metadata)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token || !session.user) throw new Error("Not logged in");

  // Helper to safely extract language from the session we already have
  const getLanguageFromSession = () => {
    return session.user.user_metadata?.language;
  };

  // 2. Try backend /me
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`/me returned ${res.status}: ${text}`);
    } else {
      const json = await res.json();
      if (json && (json.language || json.language === "")) {
        return json;
      }

      // B. If backend is missing language, enrich it using the SESSION (No extra API call!)
      const languageFromMeta = getLanguageFromSession();
      
      if (languageFromMeta) {
        return {
          ...json,
          language: languageFromMeta,
        };
      }

      // Return backend response as-is if no language found anywhere
      return json; 
    }
  } catch (err) {
    console.warn("Error calling backend /me:", err);
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("No user available from Supabase");

    return {
      id: user.id,
      email: user.email || null,
      language: user.user_metadata?.language ?? "en", // Correctly fetches your setting
    };
  } catch (err: any) {
    console.error("Unable to get user from Supabase as fallback:", err);
    throw new Error("Failed to fetch profile from backend and Supabase");
  }
}
