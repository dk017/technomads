'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';
import { createClient } from '@/app/utils/supabase/client';
// hooks/useSubscription.ts
export const useSubscription = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    isSubscribed: false,
    isLoading: true,
    lastChecked: 0,
  });

  // Add request tracking
  const requestRef = useRef<AbortController | null>(null);
  const CACHE_DURATION = 5000; // 5 seconds cache

  useEffect(() => {
    const checkSubscription = async () => {
      // Cancel any existing request
      if (requestRef.current) {
        requestRef.current.abort();
      }

      // If no user, return early
      if (!user) {
        setState(prev => ({ ...prev, isSubscribed: false, isLoading: false }));
        return;
      }

      // Check cache
      const now = Date.now();
      if (now - state.lastChecked < CACHE_DURATION) {
        return;
      }

      // Create new abort controller
      requestRef.current = new AbortController();

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;

        setState({
          isSubscribed: !!data,
          isLoading: false,
          lastChecked: now,
        });
      } catch (error) {
        console.error('Subscription check error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSubscription();

    return () => {
      if (requestRef.current) {
        requestRef.current.abort();
      }
    };
  }, [user?.id]); // Only depend on user.id, not the entire user object

  return {
    isSubscribed: state.isSubscribed,
    isLoading: state.isLoading,
  };
};