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
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) throw new Error("Not logged in");

  // Try backend /me first
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      // If backend returns an error, fall through to Supabase fallback below
      const text = await res.text().catch(() => "");
      console.warn(`/me returned ${res.status}: ${text}`);
    } else {
      const json = await res.json();
      // If backend already returns language, just return it
      if (json && (json.language || json.language === "")) {
        return json;
      }

      // Otherwise try to enrich backend response with Supabase user metadata
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const languageFromMeta = (user as any)?.user_metadata?.language;
        if (languageFromMeta) {
          return {
            ...json,
            language: languageFromMeta,
          };
        }
      } catch (err) {
        // ignore and return backend response
      }

      // Backend response with no language — return it as-is
      return json;
    }
  } catch (err) {
    console.warn("Error calling backend /me:", err);
    // fall through to Supabase fallback
  }

  // Fallback: read user directly from Supabase client-side and expose minimal shape
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("No user available from Supabase");

    const fallbackProfile: any = {
      id: user.id,
      email: (user.email as string) || null,
      // read language from user metadata if present; otherwise default to 'en'
      language: (user as any)?.user_metadata?.language ?? "en",
    };

    return fallbackProfile;
  } catch (err: any) {
    console.error("Unable to get user from Supabase as fallback:", err);
    throw new Error("Failed to fetch profile from backend and Supabase");
  }
}
