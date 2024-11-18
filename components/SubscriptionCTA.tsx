import { FC } from 'react';
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/PricingSection";

interface SubscriptionCTAProps {
  user: any; // Replace with your user type
  jobCount: number;
  isTrialActive: boolean;
  handleSubscribe: (priceId: string) => Promise<void>;
  router: any; // Replace with appropriate router type
}

const SubscriptionCTA: FC<SubscriptionCTAProps> = ({
  user,
  jobCount,
  isTrialActive,
  handleSubscribe,
  router
}) => {
  const FREE_USER_LIMIT = 10; // Consider moving this to a constants file

  return (
    <div className="relative">
      <div
        className="absolute -top-40 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background z-10"
        aria-hidden="true"
      />
      <div className="relative z-20">
        {!user ? (
          // Trial CTA for non-logged in users
          <div className="text-center mb-8 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg">
            <p className="text-2xl font-bold text-primary">
              Start Your Free Trial
            </p>
            <p className="text-xl text-primary mt-2">
              Sign up now to get 2 days of full access to all jobs
            </p>
            <Button 
              onClick={() => router.push("/signup")}
              className="mt-4 px-8 py-2"
              size="lg"
            >
              Start Free Trial
            </Button>
          </div>
        ) : (
          // Pricing CTA for logged-in users without active trial
          !isTrialActive && (
            <div className="space-y-6">
              <div className="text-center mb-8 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg">
                <p className="text-2xl font-bold text-primary">
                  +{jobCount - FREE_USER_LIMIT} More Jobs Available!
                </p>
                <p className="text-xl text-primary mt-2">
                  Subscribe now to unlock all job opportunities
                </p>
                <div className="mt-8">
                  <PricingSection
                    onSubscribe={handleSubscribe}
                    isLoading={false}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SubscriptionCTA;