"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobListings from "@/components/JobListings";
import CompanyProfileCard from "@/components/CompaniesPage";
import { createClient } from "@/app/utils/supabase/client";
import { Job } from "@/components/types";
export const runtime = "edge"; // Add this line

interface Company {
  id: number;
  name: string;
  size: string;
  logo_filename: string;
  description: string;
  tags: string[];
  jobCount: number;
  company_url?: string; // Add this
}

function CompanyJobsPage({ params }: { params: { companyName: string } }) {
  const companyName = decodeURIComponent(params.companyName);
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCompanyAndJobs() {
      setLoading(true);
      console.log("Fetching company:", companyName);
      const supabase = createClient();
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .ilike("name", companyName)
        .single();

      if (companyError || !companyData) {
        console.error("Error fetching company:", companyError);
        console.log("Company data:", companyData);
        router.push("/404");
        return;
      }

      setCompany(companyData);

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs_tn")
        .select("*")
        .ilike("company_name", companyData.name);

      if (jobsError) {
        console.error("Error fetching jobs:", jobsError);
      } else {
        setJobs(jobsData || []);
      }

      setLoading(false);
    }

    fetchCompanyAndJobs();
  }, [companyName, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12">
      <h1 className="text-6xl font-bold mb-8 text-center">
        Remote Jobs at {company.name}
      </h1>
      <div className="space-y-6">
        <CompanyProfileCard
          {...company}
          logo={company.logo_filename}
          description={company.description}
          tags={company.tags}
          size={company.size}
          jobCount={company.jobCount}
          org_url={
            jobs.length > 0 ? jobs[0].company_url : company.company_url || "#"
          }
        />
        <JobListings jobs={jobs} isLoading={loading} />
      </div>
    </div>
  );
}

export default CompanyJobsPage;
