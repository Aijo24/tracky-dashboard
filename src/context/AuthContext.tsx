"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@/lib/supabase/types";

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, restaurantName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const profileData = await fetchProfile(initialSession.user.id);
        setProfile(profileData);
      }

      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, restaurantName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: error as Error };
    }

    // Create user profile
    if (data.user) {
      const initials = email.substring(0, 2).toUpperCase();
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: data.user.id,
          email,
          restaurant_name: restaurantName || "",
          initials,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }

      // Create free subscription
      await supabase
        .from("subscriptions")
        .insert({
          user_id: data.user.id,
          plan_type: "free",
          status: "free",
        });
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
