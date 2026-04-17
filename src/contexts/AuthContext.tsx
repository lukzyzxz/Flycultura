import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Defensive: if OAuth tokens come back as query params (?access_token=...&refresh_token=...)
 * — Lovable broker variant — set the session manually since supabase-js only auto-detects
 * fragment (#) tokens.
 */
const consumeQueryTokens = async () => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) return;

  try {
    await supabase.auth.setSession({ access_token, refresh_token });
  } catch (e) {
    console.error("[Auth] setSession from query failed:", e);
  }

  // Clean URL
  const url = new URL(window.location.href);
  ["access_token", "refresh_token", "expires_in", "expires_at", "token_type", "provider_token"].forEach(
    (k) => url.searchParams.delete(k)
  );
  window.history.replaceState({}, "", url.toString());
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Set up listener FIRST (synchronous callback — no awaits inside!)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // 2. THEN check for existing session (and process query-token callbacks)
    (async () => {
      await consumeQueryTokens();
      const { data: { session: existing } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(existing);
      setUser(existing?.user ?? null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
