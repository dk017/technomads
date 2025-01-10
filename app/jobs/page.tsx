"use client";

import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { JobSkeleton } from "@/components/JobSkeleton";
import { useJobs } from "@/hooks/useJobs";
import debounce from "lodash/debounce";

export default function JobsPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [filters, setFilters] = useState(() => ({
    location: searchParams.get("location") || "",
    keyword: searchParams.get("keyword") || "",
    title: searchParams.get("title") || "",
  }));

  const {
    jobs,
    isLoading,
    hasMore,
    jobCount,
    fetchJobs,
    loadMoreJobs,
    setJobs,
  } = useJobs(true);

  const debouncedFilterChange = useCallback(
    debounce((location: string, keywords: string, title: string) => {
      const params = new URLSearchParams();
      if (location) params.set("location", location.trim());
      if (keywords) params.set("keyword", keywords.trim());
      if (title) params.set("title", title.trim());

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }, 300),
    [pathname, router]
  );

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const location = searchParams.get("location") || "";
    const title = searchParams.get("title") || "";
    const keyword = searchParams.get("keyword") || "";

    const newFilters = { location, keyword, title };
    setFilters(newFilters);
    setJobs([]);
    fetchJobs(newFilters, 1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchParams, fetchJobs, setJobs]);

  const handleFilterChange = useCallback(
    (location: string, keywords: string, title: string) => {
      debouncedFilterChange(location, keywords, title);
    },
    [debouncedFilterChange]
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Explore Remote Jobs
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover {jobCount} remote opportunities
        </p>
      </div>

      <JobFilters
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
