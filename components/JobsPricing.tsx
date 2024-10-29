"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
interface JobsPricingProps {
  onSubscribe: () => Promise<void>;
}

export default function JobsPricing({ onSubscribe }: JobsPricingProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await onSubscribe();
    } catch (error) {
      console.error("Subscription error:", error);
      alert("An error occurred during subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white my-8">
      <h2 className="text-2xl font-semibold mb-4">
        Subscribe to View More Jobs
      </h2>
      <p className="mb-4">
        Get unlimited access to all job listings and boost your remote career
        opportunities.
      </p>
      <Button
        type="button"
        disabled={loading}
        onClick={handleSubscribe}
        className="w-full py-2 text-sm font-semibold text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Subscribe Now
      </Button>
    </div>
  );
}
