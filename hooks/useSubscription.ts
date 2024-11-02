import { useState, useEffect } from 'react';
import { createClient } from "@/app/utils/supabase/client";
import { User } from '@supabase/supabase-js';

export const useSubscription = (user: User | null) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        // First check if any subscription exists
        const { data, error } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();


        if (error) {
          console.error('Error checking subscription:', error);
          setIsSubscribed(false);
        } else {
          // Check if data exists and status is active
          setIsSubscribed(data?.status === 'active');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return { isSubscribed, isLoading };
};