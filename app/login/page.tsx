"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Login - Auth response:", {
        success: !!data.session,
        hasError: !!error,
      });

      if (error) {
        // On failure: Stay on same page and show error toast
        console.log("Login error:", error);
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // On success:
      // 1. Show success toast
      if (data.session) {
        console.log("Login - Success, session established");

        // Verify the user is actually logged in
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        console.log("Login - User verification:", { hasUser: !!user });

        // Successful login
        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });
        router.prefetch("/");
        // Use replace instead of push to prevent back navigation to login
        router.replace("/");
      }
    } catch (error: any) {
      console.error("Login - Unexpected error:", error);

      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    console.log("handleGoogleLogin");
    console.log(process.env.NEXT_PUBLIC_SITE_URL);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { user, isLoading: authLoading } = useAuth() || {};

  useEffect(() => {
    if (user && !authLoading) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Log In with Google"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
