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

  const createTrialSubscription = async (userId: string) => {
    const supabase = createClient();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 2); // 2 days trial
    const now = new Date().toISOString();

    // First check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (existingSubscription) {
      console.log("User already has an active subscription");
      return;
    }

    // Create new trial subscription
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        status: "active",
        price_id: "trial",
        quantity: 1,
        trial_start: now,
        trial_end: trialEnd.toISOString(),
        current_period_start: now,
        current_period_end: trialEnd.toISOString(),
        created_at: now,
        cancel_at_period_end: false,
      });

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      throw subscriptionError;
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
          // Check if subscription already exists
          const { data: existingSubscription } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("user_id", data.user.id)
            .eq("status", "active")
            .single();

          if (!existingSubscription) {
            await createTrialSubscription(data.user.id);
          }

          console.log("Trial subscription handled, showing success toast");
          setErrorMessage(
            "Please check your email to verify your account before logging in."
          );
          router.push("/verify-email");
        } catch (error) {
          console.log("Trial subscription creation failed:", error);
          setErrorMessage(
            "Account created but trial setup failed. Please contact support."
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
