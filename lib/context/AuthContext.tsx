"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Profile, UserRole } from "@/types/database";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    loading: true,
  });

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data as Profile;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSession = useCallback(async (user: User | null) => {
    if (!user) {
      setState({ user: null, profile: null, role: null, loading: false });
      return;
    }
    const metaRole = user.user_metadata?.role as UserRole | undefined;
    if (metaRole) {
      setState({ user, profile: null, role: metaRole, loading: false });
      const profile = await fetchProfile(user.id);
      setState((prev) => ({ ...prev, profile }));
    } else {
      const profile = await fetchProfile(user.id);
      setState({ user, profile, role: (profile?.role as UserRole) ?? null, loading: false });
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) handleSession(session?.user ?? null);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (mounted) handleSession(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, role: null, loading: false });
    window.location.href = "/auth/login";
  };

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    setState((prev) => ({ ...prev, profile, role: (profile?.role as UserRole) ?? prev.role }));
  }, [state.user, fetchProfile]);

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
