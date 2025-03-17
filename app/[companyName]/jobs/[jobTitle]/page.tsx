"use client";

import JobDetailsPage from "@/components/JobDetailsPage";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Job } from "@/components/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const runtime = "edge";

const JobDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Company Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-16 w-16 rounded-lg" /> {/* Company Logo */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" /> {/* Company Name */}
          <Skeleton className="h-4 w-32" /> {/* Company Size */}
        </div>
      </div>

      {/* Job Title Skeleton */}
      <Skeleton className="h-8 w-3/4 mb-6" />

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" /> {/* Job Info Card */}
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full" /> {/* Job Description */}
          <Skeleton className="h-32 w-full" /> {/* Requirements */}
          <Skeleton className="h-32 w-full" /> {/* Benefits */}
        </div>
      </div>
    </div>
  );
};

const normalizeCompanyName = (name: string): string => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const JobNotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
    <FileX className="h-16 w-16 text-muted-foreground mb-6" />
    <h1 className="text-3xl font-semibold mb-3">Job Not Found</h1>
    <p className="text-muted-foreground text-center max-w-md mb-8">
      The job posting you are looking for might have been removed or is no
      longer available.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Button asChild>
        <a href="/">Browse Latest Jobs</a>
      </Button>
      <Button variant="outline" asChild>
        <a href="/remote-hiring-companies">View All Companies</a>
      </Button>
    </div>
  </div>
);

const InterviewPrepCTA = () => (
  <div className="bg-card rounded-lg p-6 border border-border mt-6">
    <h3 className="text-lg font-semibold mb-2">Prepare for Your Interview</h3>
    <p className="text-muted-foreground mb-4">
      Get ready for your tech interview with expert-led courses and mock
      interviews.
    </p>
    <Button asChild>
      <a
        href="https://www.tryexponent.com/?ref=mzc4yja"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center"
        aria-label="Prepare for your interview with Exponent"
      >
        Start Interview Prep
      </a>
    </Button>
  </div>
);

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
    fetchedRef.current = true;

    async function fetchJobAndCompany() {
      try {
        const supabase = createClient();
        const companySlug = params.companyName;
        console.log("Company Slug:", companySlug);
        console.log("Job Title:", params.jobTitle);
        const [jobResponse, companyResponse] = await Promise.all([
          supabase
            .from("jobs_tn")
            .select("*")
            .eq("job_slug", params.jobTitle)
            .eq("company_slug", companySlug)
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("companies")
            .select("*")
            .eq("company_slug", companySlug)
            .single(),
        ]);

        if (jobResponse.error) {
          console.error("Error fetching job:", jobResponse.error);
          return;
        }

        const job = jobResponse.data?.[0];
        if (!job) {
          console.error("No job found");
          return;
        }

        const company = companyResponse.data || {
          name: job.company_name,
          description: "",
          size: job.company_size,
          tags: [],
        };

        setJob(job);
        setCompany(company);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobAndCompany();
  }, [params.companyName, params.jobTitle]);

  if (loading) {
    return <JobDetailsSkeleton />;
  }

  if (!job) {
    return <JobNotFound />;
  }

  return (
    <JobDetailsPage
      job={job}
      company={company}
      additionalContent={<InterviewPrepCTA />}
    />
  );
}
