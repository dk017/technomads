import { useState, useCallback, useEffect, useRef } from 'react';
import { createClient } from "@/app/utils/supabase/client";
import { Job } from '@/components/types';
// Removed the import of 'Job' from '@/components/types' due to the error indicating it's not an exported member.

const ITEMS_PER_PAGE = 10;
const FREE_USER_LIMIT = 10;
interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  experience?: string;
  category?: string;
  minSalary?: string;
  workType?: string;
}

const createFlexibleTitlePattern = (title: string) => {
  const tokens = title.toLowerCase()
    .split(/[\s-]+/)  // Split on both spaces and hyphens
    .filter(Boolean);
  return `%${tokens.join('%')}%`;
};

async function fetchJobsFromAPI(
  filters: FilterParams,
  page: number,
  limit: number
): Promise<{ data: Job[]; count: number }> {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  // Start building the query
  let query = supabase
    .from('jobs_tn')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters.location) {
    query = query.eq('country', filters.location);
  }

  if (filters.keyword) {
    query = query.or([
      `title.ilike.%${filters.keyword}%`,
      `job_description.ilike.%${filters.keyword}%`,
      `company_name.ilike.%${filters.keyword}%`,
      `skills.ilike.%${filters.keyword}%`
    ].join(','));
  }

  if (filters.title) {
    const pattern = createFlexibleTitlePattern(filters.title);

    query = query.or([
      `title.ilike.${pattern}`,
      `tags.ilike.${pattern}`,
      `skills.ilike.${pattern}`
    ].join(','));
  }

  if (filters.minSalary) {
    // Assuming salary is stored as a number
    query = query.gte('salary', filters.minSalary);
  }

  // Add work type filter
  if (filters.workType && filters.workType !== 'all') {
    query = query.eq('work_type', filters.workType);
  }
  // Add experience filter
  if (filters.experience && filters.experience !== 'any') {
    // Define experience level mappings
    const experienceMappings: { [key: string]: string[] } = {
      'entry-level': ['0-2', 'entry-level', 'junior', '0-1', '1-2'],
      'mid-level': ['2-5', '3-5', 'mid-level', 'intermediate'],
      'senior': ['5+', '5-10', '7+', '10+', 'senior', 'lead', 'principal']
    };

    // Get the array of possible experience values for the selected level
    const experienceValues = experienceMappings[filters.experience];

    if (experienceValues) {
      // Create an OR condition for all possible experience values
      query = query.or(
        experienceValues.map(value => `experience.ilike.%${value}%`).join(',')
      );
    }
  }

  // Add pagination
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  try {
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    return {
      data: [],
      count: 0
    };
  }
}

export const useJobs = (showAllJobs: boolean) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [jobCount, setJobCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterParams>({
    location: '',
    keyword: '',
    title: '',
    workType: 'all'
  });

  const fetchJobs = useCallback(async (filters: FilterParams, page: number) => {
    setCurrentFilters(filters);
    setIsLoading(true);
    try {
      const limit = showAllJobs ? ITEMS_PER_PAGE : FREE_USER_LIMIT;
      const { data: newJobs, count } = await fetchJobsFromAPI(filters, page, limit);

      setJobs(newJobs || []);
      setJobCount(count || 0);
      setCurrentPage(page);
      setHasMore((newJobs?.length || 0) >= limit);
    } catch (error) {
      setJobs([]);
      setJobCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [showAllJobs]);

  const loadMoreJobs = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const limit = showAllJobs ? ITEMS_PER_PAGE : FREE_USER_LIMIT;

      const { data: newJobs } = await fetchJobsFromAPI(currentFilters, nextPage, limit);

      if (newJobs && newJobs.length > 0) {
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
        setCurrentPage(nextPage);
        setHasMore(newJobs.length >= limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, showAllJobs, currentFilters]);

  return {
    jobs,
    isLoading,
    hasMore,
    jobCount,
    currentPage,
    fetchJobs,
    loadMoreJobs,
    isLoadingMore,
    setJobs,
  };
}

export type { FilterParams, Job };
