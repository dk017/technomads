"use client";

import { notFound } from "next/navigation";
import RelevantJobs from "@/components/RelevantJobs";
import { createClient } from "@/app/utils/supabase/client";
import JobDetailPage from "@/components/JobDetailsPage";
import { useEffect, useState } from "react";
import { Job } from "@/components/types";
import { useAuth } from "@/components/AuthContext";
import { useTrialStatus } from "@/hooks/useTrialStatus"; // Add this
import { loadStripe } from "@stripe/stripe-js"; // Add this

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
  const { user, isVerified } = useAuth();
  const { isTrialActive } = useTrialStatus(); // Add this

  const handleSubscribe = async (priceId: string) => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No session found");
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: session.user.id,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Error redirecting to checkout:", error);
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

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
        const relatedJobs = await getRelatedJobs(job, isVerified);

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
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobDetails();
  }, [params.companyName, params.jobTitle, isVerified]);

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
            isVerified={isVerified}
            user={user}
            jobCount={relatedJobs.length}
            isTrialActive={isTrialActive}
            handleSubscribe={handleSubscribe}
          />
        </div>
      )}
    </div>
  );
}

const getRelatedJobs = async (job: Job, isVerified: boolean) => {
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

    // Apply limit based on verification status
    const limit = isVerified ? 10 : 5;

    const { data: relatedJobs, error } = await supabase
      .from("jobs_tn")
      .select("*")
      .neq("id", job.id)
      .or(titleConditions)
      .limit(limit);

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

    // Sort by relevance but don't slice for verified users
    const sortedJobs = scoredJobs
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, isVerified ? 10 : 5);

    console.log("Returning sorted related jobs:", sortedJobs.length);
    return sortedJobs;
  } catch (error) {
    console.error("Error fetching related jobs:", error);
    return [];
  }
};

// Separate function to calculate relevance
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
