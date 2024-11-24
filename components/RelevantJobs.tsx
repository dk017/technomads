import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  GlobeIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import PricingSection from "./PricingSection";

interface RelatedJob {
  id: number;
  title: string;
  company_name: string;
  job_slug: string;
  country: string;
  employment_type: string;
  experience: string;
  category: string;
  company_size: string;
  short_description: string;
  logo_url: string;
  city: string;
  salary: string;
}

interface RelatedJobsProps {
  jobs: RelatedJob[];
  isVerified?: boolean;
  user?: any;
  jobCount: number;
  isTrialActive?: boolean;
  handleSubscribe?: (priceId: string) => Promise<void>;
}

function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RelatedJobs: React.FC<RelatedJobsProps> = ({
  jobs,
  isVerified,
  user,
  jobCount,
  isTrialActive,
  handleSubscribe,
}) => {
  const router = useRouter();

  const showAllJobs = isVerified || isTrialActive;
  const canAccessAllJobs = isVerified || isTrialActive;
  const FREE_LIMIT = 5;

  console.log({
    totalJobs: jobs.length,
    showAllJobs,
    canAccessAllJobs,
    isVerified,
    isTrialActive,
    user: !!user,
  });

  const shouldShowPricing = !canAccessAllJobs && jobs.length > FREE_LIMIT;
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, FREE_LIMIT);

  if (jobs.length === 0) return null;

  return (
    <div className="mt-8 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="space-y-4">
        {displayedJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 relative">
                    <Image
                      src="/default-company-logo.png"
                      alt={`${job.company_name} logo`}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {job.company_name}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <BuildingIcon className="h-4 w-4 mr-2" />
                      <span>{job.company_size}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-200">
                {job.short_description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  <GlobeIcon className="h-3 w-3 mr-1" />
                  {job.country}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {job.employment_type}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                >
                  <BriefcaseIcon className="h-3 w-3 mr-1" />
                  {job.experience}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                >
                  {job.category}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{job.city}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <Link
                    href={`/${generateSlug(
                      job.company_name
                    )}/jobs/${generateSlug(job.job_slug)}`}
                  >
                    View Job
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-center p-4 text-gray-400">
          {!canAccessAllJobs && jobs.length > FREE_LIMIT ? (
            <div>
              <p>
                Showing {displayedJobs.length} of {jobs.length} jobs
              </p>
              <p>
                {jobs.length - FREE_LIMIT} more jobs available with subscription
              </p>
            </div>
          ) : null}
        </div>

        {shouldShowPricing && (
          <div className="relative mt-8">
            <div
              className="absolute -top-40 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background z-10"
              aria-hidden="true"
            />
            <div className="relative z-20">
              {!user ? (
                <div className="text-center mb-8">
                  <p className="text-2xl font-bold text-primary">
                    Start Your Free Trial
                  </p>
                  <p className="text-xl text-primary mt-2">
                    Sign up now to get 2 days of full access to all jobs
                  </p>
                  <Button
                    onClick={() => router.push("/signup")}
                    className="mt-4"
                  >
                    Start Free Trial
                  </Button>
                </div>
              ) : (
                !isTrialActive && (
                  <>
                    <div className="text-center mb-8">
                      <p className="text-2xl font-bold text-primary">
                        +{jobs.length - FREE_LIMIT} More Jobs Available!
                      </p>
                      <p className="text-xl text-primary mt-2">
                        Subscribe now to unlock all job opportunities
                      </p>
                    </div>
                    <PricingSection
                      onSubscribe={handleSubscribe!}
                      isLoading={false}
                    />
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedJobs;
