"use client";

import JobDetailsPage from "@/components/JobDetailsPage";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { Job } from "@/components/types";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function Page({ params }: { params: { jobId: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobAndCompany() {
      const supabase = createClient();
      const { data: jobData, error: jobError } = await supabase
        .from("jobs_tn")
        .select("*")
        .eq("id", params.jobId)
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
      setLoading(false);
    }

    fetchJobAndCompany();
  }, [params.jobId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return <JobDetailsPage job={job} company={company} />;
}
