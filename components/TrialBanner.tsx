"use client";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function TrialBanner() {
  const { isTrialActive, trialEndsAt } = useTrialStatus();
  const router = useRouter();

  if (!isTrialActive || !trialEndsAt) return null;

  return (
    <div className="bg-primary/10 p-2 text-center">
      <p className="text-sm">
        Trial expires in {formatDistanceToNow(trialEndsAt)}.{" "}
        <Button
          variant="link"
          className="text-primary font-semibold"
          onClick={() => router.push("/pricing")}
        >
          Upgrade now
        </Button>
      </p>
    </div>
  );
}
