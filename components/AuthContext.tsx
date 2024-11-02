"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const logAuthFlow = (step: string, data: any) => {
      const logs = JSON.parse(localStorage.getItem("authFlow") || "[]");
      logs.push({ timestamp: new Date().toISOString(), step, data });
      localStorage.setItem("authFlow", JSON.stringify(logs));
    };

    logAuthFlow("auth-context-init", { pathname: window.location.pathname });

    // Initial session check
    const initializeAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        logAuthFlow("initial-user-check", { hasUser: !!user });
        setUser(user);
      } catch (error) {
        logAuthFlow("initial-user-check-error", { error });
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logAuthFlow("auth-state-change", { event, hasSession: !!session });
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
