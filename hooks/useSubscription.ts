'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { createClient } from '@/app/utils/supabase/client';

export const useSubscription = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const checkSubscription = async () => {
      if (!user) {
        if (isMounted) {
          setIsSubscribed(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const supabase = createClient();

        // Get the most recent active subscription
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (isMounted) {
          setIsSubscribed(!!subscription);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Subscription check error:', error);
        if (isMounted) {
          setIsSubscribed(false);
          setIsLoading(false);
        }
      }
    };

    checkSubscription();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [user?.id]); // Only depend on user.id, not the entire user object

  return { isSubscribed, isLoading };
};
