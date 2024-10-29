"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/app/utils/supabase/client";
import { revalidatePath } from "next/cache";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { user, isLoading: authLoading } = useAuth() || {};

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    const supabase = createClient();
    console.log("Logging in with email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log("Login successful", data);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      revalidatePath("/");
      redirect("/");
      // Wait for the next tick to ensure state updates before navigation
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null; // or a loading indicator
  }

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
