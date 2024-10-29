"use client";

import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { JobSkeleton } from "@/components/JobSkeleton";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";
import { createClient } from "@/app/utils/supabase/client";
import { useJobs } from "@/hooks/useJobs";

// Type definitions
interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  category?: string;
}

const PricingSection = dynamic(() => import("@/components/PricingSection"), {
  ssr: false,
});

const ITEMS_PER_PAGE = 10;
const FREE_USER_LIMIT = 10;

export default function JobsPage() {
  const { user, isLoading: authLoading } = useAuth() || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {
    jobs,
    isLoading,
    hasMore,
    jobCount,
    fetchJobs,
    loadMoreJobs,
    isLoadingMore,
  } = useJobs(isSubscribed);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL params
  const initialFilters = useMemo(
    () => ({
      location: searchParams.get("location") || "",
      keyword: searchParams.get("keyword") || "",
      title: searchParams.get("title") || "",
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState<FilterParams>(initialFilters);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      setIsSubscribed(data?.status === "active");
    };

    checkSubscription();
  }, [user]);

  // Debounced URL update
  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: FilterParams) => {
        const updatedSearchParams = new URLSearchParams(
          searchParams.toString()
        );
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            updatedSearchParams.set(key, value.toString());
          } else {
            updatedSearchParams.delete(key);
          }
        });

        router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
          scroll: false,
        });
      }, 500),
    [pathname, router, searchParams]
  );

  // Filter change handler
  const handleFilterChange = useCallback(
    async (location: string, keywords: string, title: string) => {
      const newFilters: FilterParams = { location, keyword: keywords, title };

      try {
        await Promise.all([
          fetchJobs(newFilters, 1, true),
          new Promise((resolve) => {
            debouncedUpdateURL(newFilters);
            setTimeout(resolve, 500);
          }),
        ]);
      } catch (error) {
        console.error("Error updating filters:", error);
      }

      setFilters(newFilters);
    },
    [fetchJobs, debouncedUpdateURL]
  );
  // Subscription handler
  const handleSubscribe = async (priceId: string) => {
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

  // Initial data fetch
  useEffect(() => {
    const initialFilters: FilterParams = {
      location: searchParams.get("location") || "",
      keyword: searchParams.get("keyword") || "",
      title: searchParams.get("title") || "",
    };
    setFilters(initialFilters);
    fetchJobs(initialFilters, 1, true).catch(console.error);
  }, [searchParams, fetchJobs]);

  return (
    <div className="container mx-auto px-4 py-12">
      <JobFilters
        user={user ?? null}
        isVerified={!!user?.email_confirmed_at}
        onFilterChange={handleFilterChange}
        initialLocation={filters.location}
        initialKeywords={filters.keyword}
        initialTitle={filters.title}
      />

      <div className="relative">
        {isLoading && jobs.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <JobSkeleton key={index} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={jobs.length}
            next={loadMoreJobs}
            hasMore={isSubscribed ? hasMore : jobs.length < FREE_USER_LIMIT}
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
                  : !isSubscribed && jobCount > FREE_USER_LIMIT
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
              isLoading={isLoading}
            />
          </InfiniteScroll>
        )}

        {!isSubscribed && jobCount > FREE_USER_LIMIT && (
          <div className="relative">
            <div
              className="absolute -top-40 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background z-10"
              aria-hidden="true"
            />
            <div className="relative z-20">
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
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
