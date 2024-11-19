import { createClient } from "@/app/utils/supabase/server";

export async function generateStaticParams() {
  const supabase = createClient();

  const { data: jobs } = await supabase
    .from('jobs_tn')
    .select('company_name, job_slug');

  return (jobs || []).map((job) => ({
    companyName: generateSlug(job.company_name),
    jobTitle: generateSlug(job.job_slug),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { companyName: string; jobTitle: string };
}) {
  const decodedCompanyName = decodeURIComponent(params.companyName).replace(/-/g, ' ');
  const decodedJobTitle = decodeURIComponent(params.jobTitle);

  return {
    title: `${decodedJobTitle} at ${decodedCompanyName}`,
    description: `Job details for ${decodedJobTitle} position at ${decodedCompanyName}`,
  };
}

function generateSlug(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}