import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { supabase } from "@/app/supabaseClient";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import { jobTitleOptions } from "@/app/constants/jobTitleOptions";

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

export interface FilterState {
  location?: string | string[];
  keyword?: string | string[];
  title?: string;
}

export function useJobSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const queryParams = useMemo(
    () => ({
      location: searchParams.get("location") || "",
      keyword: searchParams.get("keyword") || "",
      title: searchParams.get("title") || "",
    }),
    [searchParams]
  );

  const fetchJobs = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const { location, keyword, title } = queryParams;

        const locationOption = jobLocationOptions.find(
          (option) => option.slug === location
        );
        const locationValue = locationOption ? locationOption.value : location;

        const titleOption = jobTitleOptions.find(
          (option) => option.value === title
        );

        let query = supabase
          .from("jobs_tn")
          .select("*")
          .range((page - 1) * 10, page * 10 - 1)
          .order("id", { ascending: false });

        if (locationValue) query = query.ilike("country", `%${locationValue}%`);
        if (keyword) {
          query = query.or(
            `title.ilike.%${keyword}%,skills.ilike.%${keyword}%,tags.ilike.%${keyword}%`
          );
        }

        if (titleOption) {
          const titleSearchTerms = [
            titleOption.value,
            ...titleOption.similarTitles,
            ...titleOption.relatedJobs,
          ]
            .map((term) => `title.ilike.%${term}%`)
            .join(",");

          query = query.or(titleSearchTerms);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
      } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [queryParams]
  );

  useEffect(() => {
    const initialFetch = async () => {
      setJobs([]);
      pageRef.current = 1;
      setHasMore(true);
      const initialJobs = await fetchJobs(1);
      setJobs(initialJobs);
      setHasMore(initialJobs.length === 10);
    };
    initialFetch();
  }, [queryParams, fetchJobs]);

  const loadMoreJobs = useCallback(async () => {
    if (loading || !hasMore) return;
    const newJobs = await fetchJobs(pageRef.current + 1);
    if (newJobs.length > 0) {
      setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      pageRef.current += 1;
      setHasMore(newJobs.length === 10);
    } else {
      setHasMore(false);
    }
  }, [loading, hasMore, fetchJobs]);

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value.length > 0) {
          params.set(key, Array.isArray(value) ? value.join(",") : value);
        } else {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return {
    jobs,
    loading,
    hasMore,
    queryParams,
    loadMoreJobs,
    handleFilterChange,
  };
}
