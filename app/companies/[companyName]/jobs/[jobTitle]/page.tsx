import { notFound } from "next/navigation";
import { supabase } from "@/app/supabaseClient";
import RelevantJobs from "@/components/RelevantJobs";
import JobDetailPage from "@/components/JobDetailsPage";

export async function generateStaticParams() {
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

async function getJobAndCompanyDetails(companyName: string, jobTitle: string) {
  console.log(`Fetching job: company="${companyName}", title="${jobTitle}"`);

  if (!companyName || !jobTitle) {
    console.log("Company name or job title is missing");
    return null;
  }

  const decodedCompanyName = decodeURIComponent(companyName).replace(/-/g, " ");
  const decodedJobTitle = decodeURIComponent(jobTitle);

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
    .ilike("name", companyName)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <JobDetailPage job={job} company={company} />
      <RelevantJobs currentJobId={job.id} tags={job.skills.split(",")} />
    </div>
  );
}
