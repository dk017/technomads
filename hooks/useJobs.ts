import { useState, useCallback, useEffect, useRef } from 'react';
import { createClient } from "@/app/utils/supabase/client";

interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  minSalary?: string;
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

export const useJobs = (showAllJobs: boolean) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [jobCount, setJobCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<FilterParams>({
    location: '',
    keyword: '',
    title: '',
  });

  const isFetchingRef = useRef(false);
  const pendingFetchRef = useRef<FilterParams | null>(null);
  const [isPendingFetch, setIsPendingFetch] = useState(false);

  const fetchJobs = useCallback(
    async (filters: FilterParams, page: number, isNewFilter: boolean = false) => {
      if (isPendingFetch) return;
      setIsPendingFetch(true);

      try {
        if (isFetchingRef.current) {
          pendingFetchRef.current = filters;
          return;
        }

        isFetchingRef.current = true;
        console.log('Fetching jobs with filters:', filters);

        if (isNewFilter) {
          setIsLoading(true);
          setCurrentFilters(filters);
        } else {
          setIsLoadingMore(true);
        }

        const supabase = createClient();
        let query = supabase
          .from("jobs_tn")
          .select("*", { count: "exact" });

        if (filters.location?.trim()) {
          query = query.ilike('country', `%${filters.location.trim()}%`);
        }

        if (filters.keyword?.trim()) {
          const keywordFilter = filters.keyword.trim();
          query = query.or(`title.ilike.%${keywordFilter}%,description.ilike.%${keywordFilter}%`);
        }

        if (filters.title?.trim()) {
          query = query.ilike('title', `%${filters.title.trim()}%`);
        }

        if (filters.minSalary && filters.minSalary !== "0") {
          const minSalaryValue = parseInt(filters.minSalary);
          query = query.or(`
            salary_min::integer >= ${minSalaryValue},
            salary_max::integer >= ${minSalaryValue},
            salary::integer >= ${minSalaryValue}
          `);
        }

        query = query.order('created_at', { ascending: false });

        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = showAllJobs ? start + ITEMS_PER_PAGE - 1 : FREE_USER_LIMIT - 1;
        query = query.range(start, end);

        console.log('Executing query with filters:', filters);
        const { data, error, count } = await query;

        if (error) throw error;

        console.log('Query results:', { resultCount: data?.length, totalCount: count });

        if (isNewFilter) {
          setJobs(data || []);
        } else {
          setJobs(prevJobs => [...prevJobs, ...(data || [])]);
        }

        if (count !== null) setJobCount(count);
        setHasMore(showAllJobs ? (count || 0) > (page * ITEMS_PER_PAGE) : false);
        setCurrentPage(page);

      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;

        // Handle any pending fetches
        if (pendingFetchRef.current) {
          const pendingFilters = pendingFetchRef.current;
          pendingFetchRef.current = null;
          fetchJobs(pendingFilters, 1, true);
        }
      }
    },
    [showAllJobs]
  );

  const loadMoreJobs = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore && !isFetchingRef.current) {
      fetchJobs(currentFilters, currentPage + 1);
    }
  }, [fetchJobs, hasMore, isLoading, isLoadingMore, currentPage, currentFilters]);

  return {
    jobs,
    isLoading,
    hasMore,
    jobCount,
    currentPage,
    fetchJobs,
    loadMoreJobs,
    isLoadingMore,
    setJobs
  };
};

export type { FilterParams, Job };