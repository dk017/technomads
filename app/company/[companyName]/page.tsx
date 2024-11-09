"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobListings from "@/components/JobListings";
import CompanyProfileCard from "@/components/CompaniesPage";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/app/utils/supabase/client";
export const runtime = "edge"; // Add this line

interface Company {
  id: number;
  name: string;
  size: string;
  logo_url: string;
  description: string;
  tags: string[];
  jobCount: number;
}

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

function CompanyJobsPage({ params }: { params: { companyName: string } }) {
  const companyName = decodeURIComponent(params.companyName);
  const router = useRouter();
  const { user } = useAuth();
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
          logo="/public/default-company-logo.png"
          description={company.description}
          tags={company.tags}
          size={company.size}
          jobCount={company.jobCount}
        />
        <JobListings
          jobs={jobs.map((job) => ({
            ...job,
            skills: job.skills.split(",").map((skill) => skill.trim()),
          }))}
          isVerified={!!user?.email_confirmed_at}
          user={user}
          isLoading={false}
        />
      </div>
    </div>
  );
}

export default CompanyJobsPage;
