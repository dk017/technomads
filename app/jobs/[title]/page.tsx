"use client"; // Mark this component as a Client Component

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "@/app/supabaseClient";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";

// Define the type for a job

interface Job {
  id: number;
  title: string;
  country: string;
  skills: string;
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
const imageUrls = ["/dk1.png", "/dk2.png", "/dk3.png", "/dk4.jpg", "/dk5.png"];

export default function JobPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const title = params.title as string; // Get the title from the URL
  const category = params.title as string; // Get the category from the URL

  const { user, isVerified } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const location = searchParams.get("locations") || "";
  const keywords = searchParams.get("keywords") || "";

  const fetchJobsRef = useRef<() => Promise<void>>();

  fetchJobsRef.current = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let query = supabase
      .from("jobs_tn")
      .select("*")
      .range((page - 1) * 10, page * 10 - 1)
      .order("created_at", { ascending: false });

    if (title) {
      const searchTerm = title.replace(/-/g, " "); // Convert hyphens to spaces
      query = query.or(
        `job_slug.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,skills.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
      );
    }

    if (location) {
      query = query.ilike("country", `%${location}%`);
    }

    if (keywords) {
      query = query.or(
        `title.ilike.%${keywords}%,skills.ilike.%${keywords}%,category.ilike.%${keywords}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      setJobs((prevJobs) => {
        const newJobs = data as Job[];
        const uniqueJobs = newJobs.filter(
          (newJob) => !prevJobs.some((prevJob) => prevJob.id === newJob.id)
        );
        return [...prevJobs, ...uniqueJobs];
      });
      setHasMore(data.length === 10);
      setPage((prevPage) => prevPage + 1);
    }

    setLoading(false);
  };

  const fetchJobs = useCallback(() => {
    if (fetchJobsRef.current) {
      fetchJobsRef.current();
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchJobs();
    }
  }, [fetchJobs]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [handleScroll]);

  const handleFilterChange = useCallback(
    (newLocation: string, newKeywords: string) => {
      setJobs([]);
      setPage(1);
      setHasMore(true);

      // Update URL without navigation
      const url = new URL(window.location.href);
      if (newLocation) {
        url.searchParams.set("locations", newLocation);
      } else {
        url.searchParams.delete("locations");
      }
      if (newKeywords) {
        url.searchParams.set("keywords", newKeywords);
      } else {
        url.searchParams.delete("keywords");
      }
      window.history.pushState({}, "", url);

      // Trigger a new job fetch with the updated filters
      fetchJobs();
    },
    [fetchJobs]
  );

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-6xl font-semibold mb-8 text-center">
            Remote {category.charAt(0).toUpperCase() + category.slice(1)} Jobs
          </h1>
          <h2 className="mx-4 mt-6 mb-6 font-regular text-2xl  text-center">
            Explore flexible and work from home{" "}
            {category.charAt(0).toUpperCase() + category.slice(1)} positions
            available worldwide.
            <br></br>
            Your career in truly remote companies - apply today.
          </h2>

          <div className="mx-4 mb-8 pt-6 flex justify-center">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center">
              <div className="flex -space-x-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="rounded-full border border-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundImage: `url(${url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top", // Adjust to focus on the head
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col sm:ml-4 text-center">
                <div className="flex items-center justify-center pb-1 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundImage: "url(/star.png)",
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <span>Loved by 10,000+ remote workers</span>
              </div>
            </div>
          </div>
          <section>
            {(!user || !isVerified) && (
              <div className="flex flex-wrap gap-4 p-4 justify-center">
                <Button variant="secondary" className="w-full sm:w-auto">
                  🔓 Unlock All Jobs
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  🔔 Receive Emails For Remote Jobs
                </Button>
              </div>
            )}
          </section>
        </section>
      </div>
      <JobFilters
        user={user}
        isVerified={isVerified}
        onFilterChange={handleFilterChange}
        initialLocation={location}
        initialKeywords={keywords}
        initialTitle={""}
      />
      <JobListings
        jobs={jobs.map((job) => ({
          ...job,
          skills: job.skills.split(",").map((skill) => skill.trim()),
        }))}
        isVerified={isVerified}
        user={user}
      />
      {loading && <p>Loading more jobs...</p>}
      {!hasMore && <p>No more jobs to load.</p>}
    </>
  );
}
