"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useAuth } from '@/components/AuthContext';

interface TrialStatus {
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  isLoading: boolean;
}

export function useTrialStatus(): TrialStatus {
  const { user } = useAuth();
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (!user) {
        setIsTrialActive(false);
        setTrialEndsAt(null);
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      try {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('trial_end, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (subscription) {
          const trialEnd = new Date(subscription.trial_end);
          // Only check trial status, don't modify the subscription
          const isTrialActive = trialEnd > new Date();

          setIsTrialActive(isTrialActive);
          setTrialEndsAt(trialEnd);
        } else {
          setIsTrialActive(false);
          setTrialEndsAt(null);
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        setIsTrialActive(false);
        setTrialEndsAt(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkTrialStatus();
  }, [user]);

  return { isTrialActive, trialEndsAt, isLoading };
}