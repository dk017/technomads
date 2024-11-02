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
    async function checkTrialStatus() {
      if (!user) {
        setIsTrialActive(false);
        setTrialEndsAt(null);
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      try {
        // Check trial period only
        const { data: trial } = await supabase
          .from('trial_periods')
          .select('trial_end, is_active')
          .eq('user_id', user.id)
          .single();

        if (trial) {
          const trialEnd = new Date(trial.trial_end);
          const isActive = trial.is_active && trialEnd > new Date();

          setIsTrialActive(isActive);
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
    }

    checkTrialStatus();
  }, [user]);

  return { isTrialActive, trialEndsAt, isLoading };
}