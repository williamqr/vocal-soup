// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchMe } from "../lib/apiClient";

type Language = "en" | "zh";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  language: Language;
  isZh: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  language: "en",
  isZh: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");

  const isZh = language === "zh";

  // Helper to get language from user metadata or fetchMe as fallback
  const loadLanguage = async (user: any) => {
    // First try user_metadata (no extra API call needed)
    const metaLanguage = user?.user_metadata?.language as Language | undefined;
    if (metaLanguage) {
      setLanguage(metaLanguage);
      return;
    }

    // Fallback to fetchMe if metadata doesn't have language
    try {
      const profile = await fetchMe() as { language?: Language };
      setLanguage(profile.language ?? "en");
    } catch (err) {
      console.error("Failed to load language preference:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadLanguage(session.user);
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadLanguage(session.user);
      } else {
        setLanguage("en"); // Reset to default when logged out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, language, isZh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
