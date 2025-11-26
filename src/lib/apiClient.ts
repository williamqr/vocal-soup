// src/lib/apiClient.ts
import { supabase } from "../lib/supabaseClient";

// In dev: use localhost for iOS simulator, or your LAN IP for a real device
const API_BASE = "https://backend-9hz3.onrender.com";

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

export async function fetchMe() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) throw new Error("Not logged in");

  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${res.status} - ${text}`);
  }

  return res.json();
}
