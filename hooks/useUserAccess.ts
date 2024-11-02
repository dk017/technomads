import { useState, useEffect } from 'react';
import { createClient } from "@/app/utils/supabase/client";
import { User } from '@supabase/supabase-js';

interface UserAccess {
  hasAccess: boolean;
  isLoading: boolean;
  accessType: 'trial' | 'subscription' | 'none';
}

export const useUserAccess = (user: User | null) => {
  const [userAccess, setUserAccess] = useState<UserAccess>({
    hasAccess: false,
    isLoading: true,
    accessType: 'none'
  });

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setUserAccess({ hasAccess: false, isLoading: false, accessType: 'none' });
        return;
      }

      try {
        const supabase = createClient();

        // First check trial status
        const { data: trialData, error: trialError } = await supabase
          .from('trials')
          .select('expires_at')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (trialData && new Date(trialData.expires_at) > new Date()) {
          setUserAccess({
            hasAccess: true,
            isLoading: false,
            accessType: 'trial'
          });
          return;
        }

        // If no active trial, check subscription
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (subError && subError.code !== 'PGRST116') {
          console.error('Error checking subscription:', subError);
        }

        if (subData?.status === 'active') {
          setUserAccess({
            hasAccess: true,
            isLoading: false,
            accessType: 'subscription'
          });
          return;
        }

        // No active trial or subscription
        setUserAccess({
          hasAccess: false,
          isLoading: false,
          accessType: 'none'
        });

      } catch (error) {
        console.error('Error checking user access:', error);
        setUserAccess({
          hasAccess: false,
          isLoading: false,
          accessType: 'none'
        });
      }
    };

    checkAccess();
  }, [user]);

  return userAccess;
};