// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = "https://qviplksdhdsfeceuotww.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_yXbgFgMnkcpTYsn-RpLFuA_KwBmvZEr";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
