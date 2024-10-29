"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/app/utils/supabase/client";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const handleTokenCheck = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log("Session check:", { hasSession: !!session, error });

        if (error || !session) {
          toast({
            title: "Invalid Link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
          router.push("/forgot-password");
          return;
        }

        setIsTokenValid(true);
      } catch (error) {
        console.error("Token check error:", error);
        router.push("/forgot-password");
      }
    };

    handleTokenCheck();
  }, [router, toast, supabase.auth]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Password update error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });

      // Sign out the user after password reset
      await supabase.auth.signOut();

      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center">Verifying reset link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Set New Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                autoComplete="new-password"
              />
              {password && password.length < 6 && (
                <p className="text-sm text-destructive">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                autoComplete="new-password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-destructive">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                password.length < 6
              }
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
