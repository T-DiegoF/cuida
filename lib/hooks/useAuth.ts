"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Profile, UserRole } from "@/types/database";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
}

interface UseAuthReturn extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    loading: true,
  });

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error.message);
        return null;
      }
      return data as Profile;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    setState((prev) => ({
      ...prev,
      profile,
      role: (profile?.role as UserRole) ?? null,
    }));
  }, [state.user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (mounted) {
          setState({
            user: session.user,
            profile,
            role: (profile?.role as UserRole) ?? null,
            loading: false,
          });
        }
      } else {
        if (mounted) {
          setState({ user: null, profile: null, role: null, loading: false });
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (mounted) {
          setState({
            user: session.user,
            profile,
            role: (profile?.role as UserRole) ?? null,
            loading: false,
          });
        }
      } else {
        if (mounted) {
          setState({ user: null, profile: null, role: null, loading: false });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, role: null, loading: false });
  };

  return { ...state, signOut, refreshProfile };
}
