// contexts/SubscriptionContext.tsx
import { createContext, useContext, useCallback, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

// Export the context
export const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

// Add a custom hook for using the context
export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { isSubscribed, isLoading } = useSubscription();
  const [forceUpdate, setForceUpdate] = useState(0);

  const refreshSubscription = useCallback(async () => {
    setForceUpdate(prev => prev + 1);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isLoading,
        refreshSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}