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
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getErrorMessage = (error: AuthError) => {
    // Handle specific error cases
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please verify your email address before logging in.";
      case "User not found":
        return "No account found with this email. Please sign up first.";
      case "Too many requests":
        return "Too many login attempts. Please try again later.";
      case "Email link is invalid or has expired":
        return "The login link has expired. Please request a new one.";
      default:
        return (
          error.message || "An error occurred during login. Please try again."
        );
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Basic validation
      if (!email.trim() || !password.trim()) {
        toast({
          title: "Error",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // Handle Supabase auth errors
        if (error instanceof AuthApiError) {
          let errorMessage = "An error occurred during login.";
          console.log(error.status);
          switch (error.status) {
            case 400:
              errorMessage =
                "Invalid email or password. Please check your credentials.";
              break;
            case 422:
              errorMessage = "Email format is invalid.";
              break;
            case 429:
              errorMessage = "Too many login attempts. Please try again later.";
              break;
            default:
              errorMessage = error.message;
          }

          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          // Handle other types of errors
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
        // Verify the session
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user?.email_confirmed_at) {
          toast({
            title: "Email Not Verified",
            description:
              "Please check your email and verify your account first.",
            variant: "destructive",
          });
          return;
        }

        // Successful login
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });

        router.prefetch("/");
        router.replace("/");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();

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
      console.error("Google login error:", error);
      toast({
        title: "Login Failed",
        description:
          error.message || "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  const { user, isLoading: authLoading } = useAuth();
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
              disabled={isLoading}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:underline"
              >
                Need an account?
              </Link>
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
