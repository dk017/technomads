"use client";

import { notFound } from "next/navigation";
import RelevantJobs from "@/components/RelevantJobs";
import { createClient } from "@/app/utils/supabase/client";
import JobDetailPage from "@/components/JobDetailsPage";
import { useEffect, useState } from "react";
import { Job } from "@/components/types";
export const runtime = "edge";

interface ScoredJob extends Job {
  relevanceScore: number;
}

interface JobPageProps {
  params: { companyName: string; jobTitle: string };
}

export default function JobPage({ params }: JobPageProps) {
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
          .ilike("company_name", `%${decodedCompanyName}%`)
          .eq("job_slug", decodedJobTitle)
          .single();

        if (jobError || !job) {
          console.error("Error fetching job:", jobError);
          notFound();
        }

        // Fetch company details
        const { data: company, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .ilike("name", `%${decodedCompanyName}%`)
          .single();

        // Fetch related jobs
        const relatedJobs = await getRelatedJobs(job);

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
          relatedJobs,
        });
      } catch (error) {
        console.error("Error:", error);
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

const getRelatedJobs = async (job: Job) => {
  const supabase = createClient();
  try {
    const titleKeywords = job.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(" ")
      .filter(
        (word) =>
          word.length > 3 &&
          !["and", "or", "the", "in", "at", "for", "to", "with"].includes(word)
      )
      .slice(0, 3);

    console.log("Searching for related jobs with keywords:", titleKeywords);

    // Build the OR conditions for title matches
    const titleConditions = titleKeywords
      .map((keyword) => `title.ilike.%${keyword}%`)
      .join(",");

    const { data: relatedJobs, error } = await supabase
      .from("jobs_tn")
      .select("*")
      .neq("id", job.id)
      .or(titleConditions)
      .limit(5);

    if (error) {
      console.error("Error in related jobs query:", error);
      return [];
    }

    console.log("Found related jobs:", relatedJobs?.length);

    if (!relatedJobs) return [];

    const scoredJobs: ScoredJob[] = relatedJobs.map((relatedJob: Job) => ({
      ...relatedJob,
      relevanceScore: calculateRelevanceScore(job, relatedJob),
    }));

    // Sort by relevance
    const sortedJobs = scoredJobs
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    console.log("Returning sorted related jobs:", sortedJobs.length);
    return sortedJobs;
  } catch (error) {
    console.error("Error fetching related jobs:", error);
    return [];
  }
};

const calculateRelevanceScore = (sourceJob: Job, relatedJob: Job): number => {
  let score = 0;

  // Title matching (0-3 points)
  const sourceTitle = sourceJob.title.toLowerCase();
  const relatedTitle = relatedJob.title.toLowerCase();
  score += sourceTitle
    .split(" ")
    .filter((word) => relatedTitle.includes(word)).length;

  // Skills matching (0-2 points)
  const sourceSkills = Array.isArray(sourceJob.skills) ? sourceJob.skills : [];
  const relatedSkills = Array.isArray(relatedJob.skills)
    ? relatedJob.skills
    : [];

  if (sourceSkills.length && relatedSkills.length) {
    const matchingSkills = sourceSkills.filter((skill) =>
      relatedSkills.some((rs) => rs.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    score += Math.min(matchingSkills, 2);
  }

  return score;
};
