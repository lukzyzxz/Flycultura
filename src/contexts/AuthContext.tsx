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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug: confirm auth boot in published site
    console.log("[Auth] boot — url:", window.location.href);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Auth] event:", event, "user:", session?.user?.email ?? null);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Defensive: if tokens arrive as query params (?access_token=...&refresh_token=...)
    // — Lovable OAuth broker variant — set the session manually since supabase-js
    // only auto-detects fragment (#) tokens.
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      console.log("[Auth] detected tokens in query — setting session");
      supabase.auth.setSession({ access_token, refresh_token }).then(({ data, error }) => {
        if (error) console.error("[Auth] setSession error:", error);
        else console.log("[Auth] setSession ok:", data.user?.email);
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete("access_token");
        url.searchParams.delete("refresh_token");
        url.searchParams.delete("expires_in");
        url.searchParams.delete("expires_at");
        url.searchParams.delete("token_type");
        url.searchParams.delete("provider_token");
        window.history.replaceState({}, "", url.toString());
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("[Auth] getSession:", session?.user?.email ?? "none");
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
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
        emailRedirectTo: window.location.origin,
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
