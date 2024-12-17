import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/app/utils/supabase/client";

export type SubscriptionTier = "free" | "trial" | "monthly" | "annual";

interface SubscriptionStatus {
  isSubscribed: boolean;
  tier: SubscriptionTier;
  expiresAt: string | null;
  canUpgrade: boolean;
}

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    tier: "free",
    expiresAt: null,
    canUpgrade: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user?.id) {
      setStatus({
        isSubscribed: false,
        tier: "free",
        expiresAt: null,
        canUpgrade: false,
      });
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      console.log("subscription", subscription);

      if (error) throw error;

      // Determine subscription tier
      let tier: SubscriptionTier = "free";
      let expiresAt = null;

      if (subscription && Array.isArray(subscription)) {
        console.log("subscription", subscription);
        const firstSubscription = subscription[0];
        console.log("firstSubscription", firstSubscription);
        const trialEnd = new Date(firstSubscription.trial_end);
        const isTrialActive = trialEnd > new Date();

        if (isTrialActive) {
          tier = "trial";
          expiresAt = firstSubscription.current_period_end;
        } else if (firstSubscription.price_id?.includes("monthly")) {
          tier = "monthly";
          expiresAt = firstSubscription.current_period_end;
        } else if (firstSubscription.price_id?.includes("annual")) {
          tier = "annual";
          expiresAt = firstSubscription.current_period_end;
        }
      }
      setStatus({
        isSubscribed: !!subscription,
        tier,
        expiresAt,
        canUpgrade: tier === "trial" || tier === "monthly",
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  return { ...status, isLoading, refetch: fetchSubscriptionStatus };
};
