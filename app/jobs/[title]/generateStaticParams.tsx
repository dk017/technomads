import { supabase } from '@/app/supabaseClient';

export async function generateStaticParams() {
  // Fetch job titles from your database or define them statically
  const { data: jobs, error } = await supabase.from('jobs_nh').select('title');

  if (error) {
    console.error("Failed to fetch job titles:", error);
    return [];
  }

  // Return an array of params objects
  return jobs.map((job) => ({
    title: job.title,
  }));
}