"use client";

import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
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
import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { JobSkeleton } from "@/components/JobSkeleton";
import { LoadingSpinner } from "@/components/loading-spinner";

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
        initialLocation={filters.location}
        initialKeywords={filters.keyword}
        initialTitle={filters.title}
        initialSalary={filters.minSalary}
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

    <div className="mx-4 mb-8 pt-6 flex justify-center">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center">
        <div className="flex items-center gap-6">
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
