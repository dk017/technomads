import { notFound } from "next/navigation";
import RelevantJobs from "@/components/RelevantJobs";
import { createClient } from "@/app/utils/supabase/client";
import JobDetailPage from "@/components/JobDetailsPage";
import { titleOptions } from "@/app/constants/titleOptions";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: jobs } = await supabase
    .from("jobs_tn")
    .select("company_name, job_slug");

  return (
    jobs?.map((job) => ({
      companyName: job.company_name,
      jobTitle: job.job_slug,
    })) || []
  );
}

function extractKeywordsFromTitle(title: string): string[] {
  return titleOptions
    .filter((option) =>
      title.toLowerCase().includes(option.value.toLowerCase())
    )
    .map((option) => option.value);
}

async function getRelatedJobs(currentJobId: number, jobTitle: string) {
  const keywords = extractKeywordsFromTitle(jobTitle);
  const supabase = createClient();
  if (keywords.length === 0) return [];
  const { data: relatedJobs, error } = await supabase
    .from("jobs_tn")
    .select(
      `
      id, title, company_name, job_slug, country, employment_type,
      experience, category, company_size, short_description,
      logo_url, city, salary
    `
    )
    .neq("id", currentJobId)
    .or(keywords.map((keyword) => `title.ilike.%${keyword}%`).join(","))
    .limit(5);

  if (error) {
    console.error("Error fetching related jobs:", error);
    return [];
  }

  return relatedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company_name: job.company_name,
    job_slug: job.job_slug,
    country: job.country || "Not specified",
    employment_type: job.employment_type || "Not specified",
    experience: job.experience || "Not specified",
    category: job.category || "Uncategorized",
    company_size: job.company_size || "Not specified",
    short_description: job.short_description || "",
    logo_url: "/public/default-company-logo.png",
    city: job.city || "Not specified",
    salary: job.salary || "Not specified",
  }));
}

async function getJobAndCompanyDetails(companyName: string, jobTitle: string) {
  console.log(`Fetching job: company="${companyName}", title="${jobTitle}"`);

  if (!companyName || !jobTitle) {
    console.log("Company name or job title is missing");
    return null;
  }

  const decodedCompanyName = decodeURIComponent(companyName).replace(/-/g, " ");
  const decodedJobTitle = decodeURIComponent(jobTitle);
  console.log(
    `Decoded: company="${decodedCompanyName}", title="${decodedJobTitle}"`
  );
  const supabase = createClient();
  // Fetch job details
  const { data: job, error: jobError } = await supabase
    .from("jobs_tn")
    .select("*")
    .ilike("company_name", decodedCompanyName)
    .ilike("job_slug", decodedJobTitle)
    .single();

  if (jobError) {
    console.error("Error fetching job:", jobError);
    return null;
  }

  if (!job) {
    console.log("No job found matching the criteria");
    return null;
  }

  // Fetch company details
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .ilike("name", decodedCompanyName)
    .single();

  if (companyError) {
    console.error("Error fetching company:", companyError);
    return null;
  }

  if (!company) {
    console.log("No company found matching the criteria");
    return null;
  }

  return { job, company };
}

export default async function JobPage({
  params,
}: {
  params: { companyName: string; jobTitle: string };
}) {
  const result = await getJobAndCompanyDetails(
    params.companyName,
    params.jobTitle
  );

  if (!result) {
    notFound();
  }

  const { job, company } = result;
  const relatedJobs = await getRelatedJobs(job.id, job.title);

  return (
    <div>
      <JobDetailPage job={job} company={company} />
      <RelevantJobs
        jobs={relatedJobs.map((job) => ({
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
          logo_url: "/public/default-company-logo.png",
          city: job.city || "Not specified",
          salary: job.salary || "Not specified",
        }))}
      />
    </div>
  );
}
