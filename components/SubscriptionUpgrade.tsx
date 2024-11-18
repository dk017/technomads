import { Button } from "@/components/ui/button";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useRouter } from "next/navigation";

export const SubscriptionUpgrade = () => {
  const { tier, canUpgrade, isLoading } = useSubscriptionStatus();
  const router = useRouter();

  if (isLoading || !canUpgrade) return null;

  return (
    <div className="ml-4">
      {" "}
      {/* Changed from Button to div */}
      <Button onClick={() => router.push("/pricing")} variant="outline">
        Upgrade to {tier === "monthly" ? "Annual" : "Premium"}
      </Button>
    </div>
  );
};
