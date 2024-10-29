import { useState, useCallback, useEffect } from 'react';
import { createClient } from "@/app/utils/supabase/client";

interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  category?: string;
}

interface Job {
  id: number;
  title: string;
  country: string;
  skills: string[];
  visa_sponsorship: boolean;
  company_name: string;
  company_size: string;
  employment_type: string;
  salary: string;
  logo_url: string;
  job_url: string;
  short_description: string;
  description: string;
  category: string;
  company_url: string;
  experience: string;
  city: string;
  job_slug: string;
  formatted_description: {
    sections: {
      title: string;
      items: string[];
    }[];
  };
}

const ITEMS_PER_PAGE = 10;
const FREE_USER_LIMIT = 10;

export const useJobs = (isSubscribed: boolean) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Add this
  const [jobCount, setJobCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<FilterParams>({
    location: '',
    keyword: '',
    title: '',
  });


  const fetchJobs = useCallback(
    async (
      filters: FilterParams,
      page: number,
      isNewFilter: boolean = false
    ) => {
      if (isNewFilter) {
        setIsLoading(true);
        setCurrentFilters(filters);
      } else {
        setIsLoadingMore(true);
      }
      const supabase = createClient();

      try {
        let query = supabase
          .from("jobs_tn")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false });

        // Calculate range based on subscription status
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = isSubscribed
          ? page * ITEMS_PER_PAGE - 1
          : Math.min(FREE_USER_LIMIT - 1, page * ITEMS_PER_PAGE - 1);

        query = query.range(start, end);

        // Apply filters
        if (currentFilters.category) {
          query = query.eq("category", currentFilters.category);
        }
        if (currentFilters.location?.trim()) {
          query = query.or(
            `country.ilike.%${currentFilters.location}%,city.ilike.%${currentFilters.location}%`
          );
        }
        if (currentFilters.title) {
          query = query.ilike("title", `%${currentFilters.title}%`);
        }
        if (currentFilters.keyword) {
          query = query.or(
            `title.ilike.%${currentFilters.keyword}%,tags.ilike.%${currentFilters.keyword}%,skills.ilike.%${currentFilters.keyword}%`
          );
        }

        const { data, error, count } = await query;

        if (error) throw error;

        setJobs((prevJobs) => {
          if (isNewFilter || page === 1) return data || [];
          return [...prevJobs, ...(data || [])];
        });

        if (count !== null) {
          setJobCount(count);
        }

        // Update hasMore based on subscription status
        const hasMoreItems = isSubscribed
          ? (count || 0) > page * ITEMS_PER_PAGE
          : false;
        setHasMore(hasMoreItems);

        setCurrentPage(page);
        return { data, count };
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      } finally {
        if (isNewFilter) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [isSubscribed]
  );

  const loadMoreJobs = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchJobs(currentFilters, currentPage + 1);
    }
  }, [fetchJobs, hasMore, isLoading, currentPage, currentFilters]);

  return {
    jobs,
    isLoading,
    hasMore,
    jobCount,
    currentPage,
    fetchJobs,
    loadMoreJobs,
    isLoadingMore
  };
};

export type { FilterParams, Job };