// src/lib/apiClient.ts
import { supabase } from "../lib/supabaseClient";

// In dev: use localhost for iOS simulator, or your LAN IP for a real device
const API_BASE = "http://localhost:4000";

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
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/me`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch /me: ${res.status} - ${text}`);
  }

  return res.json();
}
