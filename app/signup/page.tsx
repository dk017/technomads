"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/app/utils/supabase/client";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const createTrialPeriod = async (userId: string) => {
    const supabase = createClient();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 2); // 2 days trial

    const { error } = await supabase.from("trial_periods").insert({
      user_id: userId,
      trial_end: trialEnd.toISOString(),
      is_active: true,
    });

    if (error) {
      console.error("Error creating trial period:", error);
      throw error;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const supabase = createClient();

    try {
      console.log("Attempting signup with email:", email);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("Signup response:", { data, error: signUpError });

      if (signUpError || !data.user) {
        console.log("Signup failed:", signUpError);
        let message = "An unexpected error occurred. Please try again later.";

        if (
          signUpError?.status === 400 ||
          signUpError?.message?.toLowerCase().includes("email")
        ) {
          message = "An account with this email already exists.";
        } else if (signUpError?.message) {
          message = signUpError.message;
        }

        setErrorMessage(message);
        return;
      }

      // Additional check for user state
      if (data.user?.identities?.length === 0) {
        console.log("User already exists (no identities created)");
        setErrorMessage("An account with this email already exists.");
        return;
      }

      // Handle successful signup
      if (data.user) {
        console.log("User created successfully:", data.user.id);
        try {
          // Check if trial period already exists
          const { data: existingTrial } = await supabase
            .from("trial_periods")
            .select("id")
            .eq("user_id", data.user.id)
            .single();

          if (!existingTrial) {
            await createTrialPeriod(data.user.id);
          }

          console.log("Trial period handled, showing success toast");
          setErrorMessage(
            "Please check your email to verify your account before logging in."
          );
          router.push("/verify-email");
        } catch (trialError) {
          console.log("Trial period creation failed:", trialError);
          setErrorMessage(
            "Account created but trial period setup failed. Please contact support."
          );
        }
      }
    } catch (error: any) {
      console.log("Unexpected error during signup:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-md">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4">
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full"
            >
              Sign Up with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
