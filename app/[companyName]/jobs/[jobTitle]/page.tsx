"use client";

import { notFound } from "next/navigation";
import RelevantJobs from "@/components/RelevantJobs";
import { createClient } from "@/app/utils/supabase/client";
import JobDetailPage from "@/components/JobDetailsPage";
import { useEffect, useState } from "react";

export default function JobPage({
  params,
}: {
  params: { companyName: string; jobTitle: string };
}) {
  const [jobData, setJobData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJobDetails() {
      const supabase = createClient();
      console.log("Supabase client created");

      // Decode and clean up the parameters
      const decodedCompanyName = decodeURIComponent(params.companyName).replace(
        /-/g,
        " "
      );
      const decodedJobTitle = decodeURIComponent(params.jobTitle);

      console.log("Fetching job details:", {
        decodedCompanyName,
        decodedJobTitle,
      });

      try {
        // Fetch job details
        const { data: job, error: jobError } = await supabase
          .from("jobs_tn")
          .select("*")
          .ilike("company_name", decodedCompanyName)
          .ilike("job_slug", decodedJobTitle)
          .single();

        if (jobError || !job) {
          console.error("Error fetching job:", jobError);
          notFound();
          return;
        }

        // Fetch company details
        const { data: company, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .ilike("name", decodedCompanyName)
          .single();

        // Fetch related jobs
        const { data: relatedJobs } = await supabase
          .from("jobs_tn")
          .select("*")
          .eq("id", job.id)
          .or(
            `category.eq.${job.category},title.ilike.%${
              job.title.split(" ")[0]
            }%`
          )
          .limit(5);

        setJobData({
          job,
          company: company || {
            name: job.company_name,
            logo: "/default-company-logo.png",
            description: "",
            tags: [],
            size: job.company_size || "Not specified",
            jobCount: 1,
          },
          relatedJobs: relatedJobs || [],
        });
      } catch (error) {
        console.error("Error:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobDetails();
  }, [params.companyName, params.jobTitle]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

  if (!jobData) return null;

  const { job, company, relatedJobs } = jobData;

  return (
    <div className="container mx-auto px-4 py-8">
      <JobDetailPage job={job} company={company} />
      {relatedJobs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
          <RelevantJobs
            jobs={relatedJobs.map((job: any) => ({
              id: job.id,
              title: job.title,
              company_name: job.company_name,
              job_slug: job.job_slug || "",
              country: job.country || "Not specified",
              employment_type: job.employment_type || "Not specified",
              experience: job.experience || "Not specified",
              category: job.category || "Uncategorized",
              company_size: job.company_size || "Not specified",
              short_description: job.short_description || "",
              logo_url: "/default-company-logo.png",
              city: job.city || "Not specified",
              salary: job.salary || "Not specified",
            }))}
          />
        </div>
      )}
    </div>
  );
}
