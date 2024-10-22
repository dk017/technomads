"use client";

import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import { useJobSearch } from "@/hooks/UseJobSearch";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useRef, useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Adjust the import path as needed
import { usePathname, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const { user, isVerified } = useAuth();
  const { hasMore, loadMoreJobs } = useJobSearch();
  const [filters, setFilters] = useState<FilterParams>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [jobs, setJobs] = useState<any[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  interface TitleSearchData {
    title: string;
    relatedJobs: string[];
    similarTitlesForMeta: string[];
  }
  const scrollRef = useRef<number>(0);
  type FilterParams = {
    category?: string;
    location?: string;
    title?: string;
    keyword?: string;
  };

  useEffect(() => {
    window.scrollTo(0, scrollRef.current);
  });

  const handleScroll = () => {
    scrollRef.current = window.pageYOffset;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchJobs = useCallback(
    async (filters: FilterParams, page: number) => {
      try {
        let query = supabase
          .from("jobs_tn")
          .select("*")
          .order("created_at", { ascending: false })
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

        // Apply filters
        if (filters.category) query = query.eq("category", filters.category);
        if (filters.location)
          query = query.ilike("location", `%${filters.location}%`);
        if (filters.title) query = query.ilike("title", `%${filters.title}%`);
        if (filters.keyword)
          query = query.or(
            `title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`
          );

        const { data, error } = await query;

        if (error) throw error;

        if (page === 1) {
          setJobs(data);
        } else {
          setJobs((prevJobs) => [...prevJobs, ...data]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    },
    [itemsPerPage]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchJobs = useCallback(debounce(fetchJobs, 300), [fetchJobs]);

  useEffect(() => {
    debouncedFetchJobs(filters, currentPage);
  }, [debouncedFetchJobs, filters, currentPage]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1);

    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedSearchParams.set(key, value.toString());
      } else {
        updatedSearchParams.delete(key);
      }
    });

    updatedSearchParams.delete("page");
    router.replace(`${pathname}?${updatedSearchParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">
        Explore Remote Job Opportunities
      </h1>

      <JobFilters
        user={user}
        isVerified={isVerified}
        onFilterChange={(location, keywords, titleData: TitleSearchData) => {
          handleFilterChange({
            location,
            keyword: keywords,
            title: titleData.title,
          });
        }}
        initialLocation={searchParams.get("location") || ""}
        initialKeywords={searchParams.get("keyword") || ""}
        initialTitle={searchParams.get("title") || ""}
      />

      <InfiniteScroll
        dataLength={jobs.length}
        next={() => setCurrentPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<p className="text-center mt-4">Loading more jobs...</p>}
        endMessage={<p className="text-center mt-4">No more jobs to load.</p>}
        scrollThreshold={0.9}
      >
        <JobListings jobs={jobs} isVerified={isVerified} user={user} />
      </InfiniteScroll>
    </div>
  );
}
