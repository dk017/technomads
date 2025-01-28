import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import { jobTitleOptions } from "@/app/constants/jobTitleOptions";
import { createTitleSearchPattern } from "@/utils/searchUtils";
import { Job } from "@/components/types";

export interface FilterState {
  location?: string;
  keyword?: string;
  title?: string;
  workType?: string;
  salary?: string;
  experience?: string;
}

const createFlexibleTitlePattern = (title: string) => {
  // Split the title into tokens and remove empty strings
  const tokens = title.toLowerCase().split(/\s+/).filter(Boolean);

  // Create a single combined pattern that matches all tokens
  const pattern = `title.ilike.%${tokens.join("%")}%`;

  console.log("Title search debug:", {
    originalTitle: title,
    tokens,
    pattern,
  });

  return pattern;
};

export function useJobSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const pageRef = useRef(1);

  // Add new state for initial values
  const [initialValues, setInitialValues] = useState<FilterState>({});

  // Modify queryParams to use both search params and initial values
  const queryParams = useMemo(
    () => ({
      location: searchParams.get("location") || initialValues.location || "",
      keyword: searchParams.get("keyword") || "",
      title: searchParams.get("title") || initialValues.title || "",
      experience:
        searchParams.get("experience") || initialValues.experience || "",
      workType: searchParams.get("workType") || "",
      salary: searchParams.get("salary") || "",
    }),
    [searchParams, initialValues]
  );

  // Add method to set initial values
  const setInitialFilters = useCallback(
    (filters: FilterState) => {
      console.log("Setting initial filters:", filters);
      setInitialValues(filters);

      // Also update URL params if they're not set
      const params = new URLSearchParams(searchParams);
      Object.entries(filters).forEach(([key, value]) => {
        if (value && !params.has(key)) {
          params.set(key, value);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const fetchJobs = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { location, keyword, title, experience, workType, salary } =
          queryParams;

        console.log("Initial params:", {
          location,
          keyword,
          title,
          experience,
          workType,
          salary,
        });

        let query = supabase.from("jobs_tn").select("*", { count: "exact" });

        // Location filter
        if (location) {
          // Log the location matching process
          console.log("Location before processing:", location);
          const locationOption = jobLocationOptions.find(
            (option) => option.slug === location
          );
          console.log("Found location option:", locationOption);

          if (locationOption) {
            query = query.ilike("country", `%${locationOption.value}%`);
          }
        }

        // Title filter
        if (title) {
          const titleConditions = [];
          const titlePattern = createFlexibleTitlePattern(title);
          titleConditions.push(`title.ilike.${titlePattern}`);
          titleConditions.push(`tags.ilike.${titlePattern}`);

          const titleOption = jobTitleOptions.find(
            (option) => option.value === title
          );

          if (titleOption) {
            [
              ...(titleOption.similarTitles || []),
              ...(titleOption.relatedJobs || []),
            ].forEach((relatedTitle) => {
              const pattern = createFlexibleTitlePattern(relatedTitle);
              titleConditions.push(`title.ilike.${pattern}`);
            });
          }

          query = query.or(titleConditions.join(","));
        }

        // Experience filter
        if (experience && experience !== "any") {
          query = query.eq("experience_level", experience);
        }

        // Work type filter
        if (workType && workType !== "all") {
          query = query.eq("work_type", workType);
        }

        // Salary filter
        if (salary) {
          query = query.gte("salary", salary);
        }

        // Keyword search
        if (keyword) {
          const keywordConditions = [
            `title.ilike.%${keyword}%`,
            `skills.ilike.%${keyword}%`,
            `tags.ilike.%${keyword}%`,
            `short_description.ilike.%${keyword}%`,
          ].join(",");
          query = query.or(keywordConditions);
        }

        // Add pagination and ordering
        query = query
          .order("created_at", { ascending: false })
          .range((page - 1) * 10, page * 10 - 1);

        // Log the final query for debugging

        const { data, error, count } = await query;

        console.log("Query results:", {
          count,
          resultsCount: data?.length,
          firstResult: data?.[0],
        });

        if (error) throw error;

        if (page === 1) {
          setTotalCount(count || 0);
        }

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

  useEffect(() => {
    console.log("Setting initial filters from props:", {
      initialTitle: initialValues.title,
      initialLocation: initialValues.location,
      initialExperience: initialValues.experience,
    });

    setInitialFilters({
      title: initialValues.title,
      location: initialValues.location,
      experience: initialValues.experience,
    });
  }, [initialValues, setInitialFilters]);

  return {
    jobs,
    loading,
    hasMore,
    totalCount,
    queryParams,
    loadMoreJobs,
    handleFilterChange,
    setInitialFilters,
  };
}
