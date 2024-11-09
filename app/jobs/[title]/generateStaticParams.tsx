import { createClient } from "@/app/utils/supabase/server";
export const runtime = 'edge'; // Add this line


export async function generateStaticParams() {
  const supabase = createClient();
  // Fetch job titles from your database or define them statically
  const { data: jobs, error } = await supabase.from("jobs_nh").select("title");

  if (error) {
    console.error("Failed to fetch job titles:", error);
    return [];
  }

  // Return an array of params objects
  return jobs.map((job) => ({
    title: job.title,
  }));
}
