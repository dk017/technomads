"use client";

import JobDetailsPage from "@/components/JobDetailsPage";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Job } from "@/components/types";
import { LoadingSpinner } from "@/components/loading-spinner";

export const runtime = "edge";
const normalizeCompanyName = (name: string): string => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function Page({
  params,
}: {
  params: {
    companyName: string;
    jobTitle: string;
  };
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    async function fetchJobAndCompany() {
      try {
        console.log("Fetching job and company data...");
        console.log(params.jobTitle);
        console.log(params.companyName);
        const supabase = createClient();
        const normalizedCompanyName = normalizeCompanyName(params.companyName);

        const { data: jobData, error: jobError } = await supabase
          .from("jobs_tn")
          .select("*")
          .eq("job_slug", params.jobTitle)
          .ilike("company_name", normalizedCompanyName)
          .single();

        if (jobError) {
          console.error("Error fetching job:", jobError);
          return;
        }

        // Fetch company data using company name from job
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("name", jobData.company_name)
          .single();

        if (companyError) {
          console.error("Error fetching company:", companyError);
        }

        setJob(jobData);
        setCompany(
          companyData || {
            name: jobData.company_name,
            description: "",
            size: jobData.company_size,
            tags: [],
          }
        );
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobAndCompany();
    return () => {
      fetchedRef.current = false;
    };
  }, [params.companyName, params.jobTitle]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return <JobDetailsPage job={job} company={company} />;
}
