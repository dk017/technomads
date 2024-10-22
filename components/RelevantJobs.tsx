import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/app/supabaseClient";

interface RelevantJobsProps {
  currentJobId: number;
  tags: string[];
}

const RelevantJobs: React.FC<RelevantJobsProps> = async ({
  currentJobId,
  tags,
}) => {
  const { data: relevantJobs } = await supabase
    .from("jobs_tn")
    .select("*")
    .neq("id", currentJobId)
    .contains("skills", tags)
    .limit(3);

  if (!relevantJobs || relevantJobs.length === 0) {
    return null;
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Similar Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relevantJobs.map((job) => (
          <Link
            key={job.id}
            href={`/companies/${generateSlug(
              job.company_name
            )}/jobs/${generateSlug(job.title)}`}
            passHref
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.company_name}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.skills
                    .split(",")
                    .slice(0, 3)
                    .map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill.trim()}
                      </Badge>
                    ))}
                </div>
                <p className="text-sm text-gray-500">
                  {job.city}, {job.country}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelevantJobs;
