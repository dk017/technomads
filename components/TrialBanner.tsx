"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TrialBanner() {
  const { isSubscribed, isLoading } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !isSubscribed || dismissed) {
    return null;
  }

  return (
    <Alert className="rounded-none border-b">
      <AlertDescription className="flex items-center justify-between">
        <span>
          You&apos;re currently on a free trial. Upgrade to access all features.
        </span>
        <div className="flex gap-4">
          <Button
            variant="default"
            size="sm"
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
