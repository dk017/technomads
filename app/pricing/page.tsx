"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Check, Shield, Clock, Globe } from "lucide-react";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import FAQ from "@/components/FAQ";
import { createClient } from "@/app/utils/supabase/client";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { isTrialActive, trialEndsAt } = useTrialStatus();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      console.error("Stripe publishable key is not defined");
      return;
    }
    const supabase = createClient();
    const {
      data: { session: authSession },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !authSession?.access_token) {
      throw new Error("Authentication required");
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authSession.access_token}`,
        },
        credentials: "include",
        body: JSON.stringify({ priceId }),
      });

      console.log("Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const session = await response.json();
      const stripe = await loadStripe(stripeKey);

      if (!stripe) throw new Error("Failed to load Stripe");

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      console.error("Error during Stripe checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const plans = [
    {
      name: "Weekly",
      price: "$5",
      period: "week",
      highlight: false,
      priceId: process.env.NEXT_PUBLIC_WEEKLY_PRICE_ID,
      features: ["Access to all job listings", "7-day access"],
    },
    {
      name: "Monthly",
      price: "$20",
      period: "month",
      highlight: true,
      priceId: process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID,
      features: ["Access to all job listings", "30-day access"],
    },
    {
      name: "Annual",
      price: "$80",
      period: "year",
      highlight: false,
      priceId: process.env.NEXT_PUBLIC_ANNUAL_PRICE_ID,
      features: ["Access to all job listings", "365-day access"],
    },
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      title: "Global Opportunities",
      description: "Access jobs from companies worldwide",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Verified Listings",
      description: "All jobs are manually verified",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Real-time Updates",
      description: "Get notified as soon as new jobs are posted",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get access to exclusive tech job opportunities and accelerate your
          career growth
        </p>
        {isTrialActive && trialEndsAt && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg inline-block">
            <p className="text-primary">
              Your trial is active! Upgrade now to continue access after trial
              ends.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-lg shadow-sm border border-border"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card rounded-lg shadow-lg p-8 ${
                plan.highlight
                  ? "border-2 border-primary relative"
                  : "border border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-card-foreground">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-card-foreground"
                  >
                    <Check className="w-5 h-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.highlight
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-primary hover:bg-primary/90"
                }`}
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <FAQ />
      </div>
    </div>
  );
}
