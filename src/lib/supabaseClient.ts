// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qviplksdhdsfeceuotww.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_yXbgFgMnkcpTYsn-RpLFuA_KwBmvZEr";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
