import getStripe from "@/app/utils/get-stripejs";
import React, { useState } from "react";

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create a Checkout Session.
    const response = await fetch("/app/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 2000 }), // $20.00
    });

    if (response.ok) {
      const { id } = await response.json();
      // Redirect to Checkout.
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({ sessionId: id });
      if (error) {
        console.warn(error.message);
      }
    } else {
      console.error("Failed to create checkout session");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Subscribe to view all jobs"}
      </button>
    </form>
  );
}
