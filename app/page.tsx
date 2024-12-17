"use client";

import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import JobExplorationSection from "@/components/JobExplorationSection";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import FAQSection from "@/components/FAQ";
import {
  BriefcaseIcon,
  RocketIcon,
  GlobeIcon,
  ShieldCheckIcon,
  ClockIcon,
  SearchCheckIcon,
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { JobSkeleton } from "@/components/JobSkeleton";
import PricingSection from "@/components/PricingSection";
import { loadStripe } from "@stripe/stripe-js";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { Button } from "@/components/ui/button";
import SubscriptionCTA from "@/components/SubscriptionCTA";
import { LoadingIndicator, EndMessage } from "@/components/LoadingComponents";

// Constants moved to top level
const ITEMS_PER_PAGE = 10;
const FREE_USER_LIMIT = 10;
const IMAGE_URLS = ["/dk1.png", "/dk2.png", "/dk3.png", "/dk4.jpg", "/dk5.png"];

interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  minSalary?: string;
}

interface JobListingsSectionProps {
  jobs: any[]; // Replace 'any' with your job type if available
  jobCount: number;
  loadingState: {
    showAllJobs: boolean;
    isLoading: boolean;
    isTrialActive?: boolean;
  };
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMoreJobs: () => void;
  user: any; // Replace 'any' with your user type if available
  handleSubscribe: (priceId: string) => Promise<void>;
  router: any; // Replace with appropriate Next.js router type
}

export default function Home() {
  // Auth and trial status
  const { user, isLoading: authLoading } = useAuth() || {};
  const { isTrialActive, isLoading: trialLoading } = useTrialStatus();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  const loadingState = useMemo(
    () => ({
      isLoading: authLoading || trialLoading || isCheckingSubscription,
      showAllJobs: isSubscribed || isTrialActive,
      canAccessAllJobs: isSubscribed || isTrialActive,
    }),
    [
      authLoading,
      trialLoading,
      isCheckingSubscription,
      isSubscribed,
      isTrialActive,
    ]
  );

  // Navigation
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Filters state
  const [filters, setFilters] = useState<FilterParams>(() => ({
    location: searchParams?.get("location") || "",
    keyword: searchParams?.get("keyword") || "",
    title: searchParams?.get("title") || "",
    minSalary: searchParams?.get("minSalary") || "",
  }));
  // Jobs fetch and management
  const {
    jobs,
    jobCount,
    fetchJobs,
    hasMore,
    loadMoreJobs,
    isLoadingMore,
    setJobs,
  } = useJobs(loadingState.showAllJobs);

  // Subscription check
  const checkSubscription = useCallback(async () => {
    if (!user?.id) return;

    setIsCheckingSubscription(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setIsSubscribed(!!data);
    } catch (error) {
      console.error("Subscription check error:", error);
    } finally {
      setIsCheckingSubscription(false);
    }
  }, [user?.id]);

  // Filter change handler
  const handleFilterChange = useCallback(
    (location: string, keywords: string, title: string, minSalary: string) => {
      const newFilters = { location, keyword: keywords, title, minSalary };
      setFilters(newFilters);

      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  // Subscription handler
  const handleSubscribe = useCallback(
    async (priceId: string) => {
      if (!user) {
        alert("Please sign in to subscribe.");
        return;
      }

      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        console.error("Stripe publishable key is not defined");
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { session: authSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !authSession?.access_token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authSession.access_token}`,
          },
          credentials: "include",
          body: JSON.stringify({ priceId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to create checkout session"
          );
        }

        const session = await response.json();
        const stripe = await loadStripe(stripeKey);
        if (!stripe) throw new Error("Failed to load Stripe");

        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) throw result.error;
      } catch (error) {
        console.error("Error during Stripe checkout:", error);
        alert("An error occurred during checkout. Please try again.");
      }
    },
    [user]
  );

  // Effects
  useEffect(() => {
    let isMounted = true;
    if (user?.id && isMounted) {
      checkSubscription();
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id, checkSubscription]);

  useEffect(() => {
    if (!loadingState.isLoading) {
      setJobs([]);
      fetchJobs(filters, 1);
    }
  }, [loadingState.isLoading, fetchJobs, filters, setJobs]);

  // Loading state
  if (loadingState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const formattedJobCount = jobCount.toLocaleString();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <HeaderSection formattedJobCount={formattedJobCount} />

      {/* Job Filters */}
      <JobFilters
        user={user ?? null}
        isVerified={!!user?.email_confirmed_at}
        onFilterChange={handleFilterChange}
        initialLocation={filters.location}
        initialKeywords={filters.keyword}
        initialTitle={filters.title}
        initialSalary={filters.minSalary}
      />

      {/* Job Listings */}
      <JobListingsSection
        jobs={jobs}
        jobCount={jobCount}
        loadingState={loadingState}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        loadMoreJobs={loadMoreJobs}
        user={user}
        handleSubscribe={handleSubscribe}
        router={router}
      />

      <FAQSection />
    </div>
  );
}

// Extracted components (define these at the bottom of the file or in separate files)
const HeaderSection = ({
  formattedJobCount,
}: {
  formattedJobCount: string;
}) => (
  <section className="mb-16">
    <h1 className="text-6xl font-semibold mb-8 text-center">
      Find Your Dream Remote Job
    </h1>
    <h2 className="mx-4 mt-6 mb-6 font-regular text-2xl  text-center">
      Search {formattedJobCount} work from home jobs and get more job interviews
    </h2>

    <div className="mx-4 mb-8 pt-6 flex justify-center">
      {/* <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center">
        <div className="flex -space-x-2">
          {IMAGE_URLS.map((url, index) => (
            <div
              key={index}
              className="rounded-full border border-white"
              style={{
                width: "40px",
                height: "40px",
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center top", // Adjust to focus on the head
              }}
            />
          ))}
        </div>
        <div className="flex flex-col sm:ml-4 text-center">
          <div className="flex items-center justify-center pb-1 space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundImage: "url(/star.png)",
                  backgroundSize: "cover",
                }}
              />
            ))}
          </div>
          <span>Loved by 10,000+ remote workers</span>
        </div>
      </div> */}
    </div>
    <div className="mx-4 mb-8 pt-6 flex justify-center">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center">
        <div className="flex items-center gap-6">
          {/* Trust Badges */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Verified Jobs</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-full">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium">Daily Updates</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-full">
              <SearchCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Quality Checked</span>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center">
        <RocketIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Launch Your Career</h3>
        <p className="text-muted-foreground">
          Find the perfect remote job to take your career to new heights
        </p>
      </div>
      <div className="text-center">
        <GlobeIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Work from Anywhere</h3>
        <p className="text-muted-foreground">
          Enjoy the flexibility of working from home or anywhere in the world
        </p>
      </div>
      <div className="text-center">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Quality Opportunities</h3>
        <p className="text-muted-foreground">
          Access top remote jobs from leading companies worldwide
        </p>
      </div>
    </div>
  </section>
);

const JobListingsSection = ({
  jobs,
  jobCount,
  loadingState,
  isLoadingMore,
  hasMore,
  loadMoreJobs,
  user,
  handleSubscribe,
  router,
}: JobListingsSectionProps) => (
  <>
    {jobs.length === 0 ? (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <JobSkeleton key={index} />
        ))}
      </div>
    ) : (
      <InfiniteScroll
        dataLength={jobs.length}
        next={loadMoreJobs}
        hasMore={
          loadingState.showAllJobs ? hasMore : jobs.length < FREE_USER_LIMIT
        }
        loader={isLoadingMore && <LoadingIndicator />}
        endMessage={
          <EndMessage
            jobs={jobs}
            jobCount={jobCount}
            showAllJobs={loadingState.showAllJobs}
          />
        }
        scrollThreshold={0.8}
        className="space-y-6"
      >
        <JobListings
          jobs={jobs}
          isVerified={!!user?.email_confirmed_at}
          user={user ?? null}
          isLoading={loadingState.isLoading}
        />
      </InfiniteScroll>
    )}

    {/* Subscription CTAs */}
    {!loadingState.showAllJobs && jobCount > FREE_USER_LIMIT && (
      <SubscriptionCTA
        user={user}
        jobCount={jobCount}
        isTrialActive={!!loadingState.isTrialActive}
        handleSubscribe={handleSubscribe}
        router={router}
      />
    )}
  </>
);
