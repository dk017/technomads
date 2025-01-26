"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobListings from "@/components/JobListings";
import CompanyProfileCard from "@/components/CompaniesPage";
import { createClient } from "@/app/utils/supabase/client";
import { Job } from "@/components/types";
import { Skeleton } from "@/components/ui/skeleton";
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

const CompanyPageSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12">
    {/* Title Skeleton */}
    <div className="flex justify-center mb-8">
      <Skeleton className="h-12 w-3/4 max-w-2xl" />
    </div>

    {/* Company Profile Card Skeleton */}
    <div className="bg-card/50 border rounded-lg p-6 mb-8">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>

    {/* Jobs Skeleton */}
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card/50 border rounded-lg p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
    return <CompanyPageSkeleton />;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12">
      <h1 className="text-5xl text-primary font-semibold mb-8 text-center">
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
