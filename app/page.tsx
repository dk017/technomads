"use client";

import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import {} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { JobSkeleton } from "@/components/JobSkeleton";
import { LoadingSpinner } from "@/components/loading-spinner";
import { debounce } from "lodash";

interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  minSalary?: string;
}

export default function Home() {
  // Navigation
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [debouncedRouter] = useState(() =>
    debounce((url: string) => router.replace(url, { scroll: false }), 800)
  );

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
    isLoading,
  } = useJobs(true);

  const debouncedSetFilters = useMemo(
    () =>
      debounce((newFilters: FilterParams) => {
        setFilters(newFilters);
      }, 800),
    []
  );

  // Filter change handler
  const handleFilterChange = useCallback(
    (location: string, keywords: string, title: string, minSalary: string) => {
      const newFilters = { location, keyword: keywords, title, minSalary };

      const params = new URLSearchParams();
      if (location) params.set("location", location);
      if (keywords) params.set("keyword", keywords);
      if (title) params.set("title", title);
      if (minSalary) params.set("minSalary", minSalary);

      // Use debounced router update
      debouncedRouter(`${pathname}?${params.toString()}`);
      debouncedSetFilters(newFilters);
    },
    [debouncedRouter, pathname, debouncedSetFilters]
  );

  useEffect(() => {
    setJobs([]);
    fetchJobs(filters, 1);
  }, [fetchJobs, filters, setJobs]);

  // Loading state
  if (isLoading && jobs.length === 0) {
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
        onFilterChange={handleFilterChange}
        initialLocation={searchParams?.get("location") || ""}
        initialKeywords={searchParams?.get("keyword") || ""}
        initialTitle={searchParams?.get("title") || ""}
        initialSalary={searchParams?.get("minSalary") || ""}
      />

      {/* Job Listings */}
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
            hasMore={hasMore}
            loader={
              <div className="mt-4 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <JobSkeleton key={index} />
                ))}
              </div>
            }
            endMessage={
              <div className="text-center p-4 text-gray-400">
                {jobs.length === 0
                  ? "No jobs found matching your criteria"
                  : "All jobs loaded"}
              </div>
            }
            scrollThreshold={0.8}
            className="space-y-6"
          >
            <JobListings jobs={jobs} isLoading={isLoading} />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

// Header Section Component
const HeaderSection = ({
  formattedJobCount,
}: {
  formattedJobCount: string;
}) => (
  <section className="mb-16">
    <h1 className="text-6xl font-semibold mb-8 text-center">
      Find Your Dream Remote Job
    </h1>
    <h2 className="mx-4 mt-6 mb-6 font-regular text-2xl text-center">
      Search {formattedJobCount} work from home jobs and get more job interviews
    </h2>
  </section>
);
