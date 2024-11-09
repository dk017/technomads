"use client";

import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { JobSkeleton } from "@/components/JobSkeleton";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";
import { useJobs } from "@/hooks/useJobs";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import debounce from "lodash/debounce";
export const runtime = "edge"; // Add this line

// Type definitions
interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  category?: string;
  minSalary?: string;
}

const PricingSection = dynamic(() => import("@/components/PricingSection"), {
  ssr: false,
});

const ITEMS_PER_PAGE = 10;
const FREE_USER_LIMIT = 10;

// Helper function to generate header text
const generateHeaderText = (filters: FilterParams, jobCount: number) => {
  let title = "Explore Remote Jobs";
  let subtitle = `Discover ${jobCount} remote opportunities`;

  if (filters.location && filters.title) {
    title = `Remote ${filters.title} Jobs in ${filters.location}`;
    subtitle = `${jobCount} remote ${filters.title.toLowerCase()} positions in ${
      filters.location
    }`;
  } else if (filters.location) {
    title = `Remote Jobs in ${filters.location}`;
    subtitle = `${jobCount} remote opportunities in ${filters.location}`;
  } else if (filters.title) {
    title = `Remote ${filters.title} Jobs`;
    subtitle = `${jobCount} remote ${filters.title.toLowerCase()} positions available`;
  }

  return { title, subtitle };
};

export default function JobsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { isSubscribed, isLoading: subscriptionLoading } =
    useSubscription(user);
  const { isTrialActive, isLoading: trialLoading } = useTrialStatus();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Abort controller ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Loading states
  const isAccessLoading = authLoading || subscriptionLoading || trialLoading;
  const showAllJobs = isSubscribed || isTrialActive;

  // State for filters
  const [filters, setFilters] = useState<FilterParams>(() => ({
    location: searchParams.get("location") || "",
    keyword: searchParams.get("keyword") || "",
    title: searchParams.get("title") || "",
  }));

  const {
    jobs,
    isLoading: jobsLoading,
    hasMore,
    jobCount,
    currentPage,
    fetchJobs,
    loadMoreJobs,
    isLoadingMore,
    setJobs,
  } = useJobs(showAllJobs);

  // Debounced filter change handler
  const debouncedFilterChange = useMemo(
    () =>
      debounce(
        (
          location: string,
          keywords: string,
          title: string,
          minSalary: string
        ) => {
          const updatedSearchParams = new URLSearchParams();
          if (location) updatedSearchParams.set("location", location.trim());
          if (keywords) updatedSearchParams.set("keyword", keywords.trim());
          if (title) updatedSearchParams.set("title", title.trim());
          if (minSalary) updatedSearchParams.set("minSalary", minSalary);

          router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
            scroll: false,
          });
        },
        300
      ),
    [pathname, router]
  );

  // Effect to handle filter changes and fetch jobs
  useEffect(() => {
    if (isAccessLoading) return;

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const location = searchParams.get("location") || "";
    const title = searchParams.get("title") || "";
    const keyword = searchParams.get("keyword") || "";

    const newFilters = {
      location,
      keyword,
      title,
    };

    const fetchData = async () => {
      try {
        setJobs([]); // Clear existing jobs before new fetch
        await fetchJobs(newFilters, 1);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching jobs:", error);
        }
      }
    };

    // Set filters and fetch data
    setFilters(newFilters);
    fetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAccessLoading, searchParams, fetchJobs, setJobs]);

  // Modified handleFilterChange to use debounced version
  const handleFilterChange = useCallback(
    (location: string, keywords: string, title: string, minSalary: string) => {
      debouncedFilterChange(location, keywords, title, minSalary);
    },
    [debouncedFilterChange]
  );

  // Subscription handler
  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      console.error("Stripe publishable key is not defined");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const session = await response.json();
      const stripe = await loadStripe(stripeKey);

      if (!stripe) throw new Error("Failed to load Stripe");

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      console.error("Error during Stripe checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const isInitialLoading = jobsLoading && jobs.length === 0;
  const canAccessAllJobs = isSubscribed || isTrialActive;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {generateHeaderText(filters, jobCount).title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {generateHeaderText(filters, jobCount).subtitle}
        </p>
      </div>

      <JobFilters
        user={user ?? null}
        isVerified={!!user?.email_confirmed_at}
        onFilterChange={handleFilterChange}
        initialLocation={filters.location}
        initialKeywords={filters.keyword}
        initialTitle={filters.title}
      />

      <div className="relative">
        {isInitialLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <JobSkeleton key={index} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={jobs.length}
            next={loadMoreJobs}
            hasMore={canAccessAllJobs ? hasMore : jobs.length < FREE_USER_LIMIT}
            loader={
              isLoadingMore && (
                <div className="mt-4 space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <JobSkeleton key={index} />
                  ))}
                </div>
              )
            }
            endMessage={
              <div className="text-center p-4 text-gray-400">
                {jobs.length === 0
                  ? "No jobs found matching your criteria"
                  : !canAccessAllJobs && jobCount > FREE_USER_LIMIT
                  ? `${
                      jobCount - FREE_USER_LIMIT
                    } more jobs available with subscription`
                  : "No more jobs to load"}
              </div>
            }
            scrollThreshold={0.8}
            className="space-y-6"
          >
            <JobListings
              jobs={jobs}
              isVerified={!!user?.email_confirmed_at}
              user={user}
              isLoading={false}
            />
          </InfiniteScroll>
        )}

        {!canAccessAllJobs && jobCount > FREE_USER_LIMIT && (
          <div className="relative">
            <div
              className="absolute -top-40 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background z-10"
              aria-hidden="true"
            />
            <div className="relative z-20">
              {!user ? (
                <div className="text-center mb-8">
                  <p className="text-2xl font-bold text-primary">
                    Start Your Free Trial
                  </p>
                  <p className="text-xl text-primary mt-2">
                    Sign up now to get 2 days of full access to all jobs
                  </p>
                  <Button
                    onClick={() => router.push("/signup")}
                    className="mt-4"
                  >
                    Start Free Trial
                  </Button>
                </div>
              ) : (
                !isTrialActive && (
                  <>
                    <div className="text-center mb-8">
                      <p className="text-2xl font-bold text-primary">
                        +{jobCount - FREE_USER_LIMIT} More Jobs Available!
                      </p>
                      <p className="text-xl text-primary mt-2">
                        Subscribe now to unlock all job opportunities
                      </p>
                    </div>
                    <PricingSection
                      onSubscribe={handleSubscribe}
                      isLoading={false}
                    />
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
