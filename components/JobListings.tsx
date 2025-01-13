import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/utils/supabase/client";

import {
  GlobeIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
} from "lucide-react";
import { JobSkeleton } from "@/components/JobSkeleton";
import { Job } from "./types";
import { getCompanyLogoUrl } from "@/utils/companyLogos";
import { getTimeAgo } from "@/hooks/dateUtils";

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

interface JobListingsProps {
  jobs: Job[];
  isLoading: boolean;
}

const JobListings: React.FC<JobListingsProps> = React.memo(
  ({ jobs, isLoading }) => {
    const [imageError, setImageError] = useState<Record<string, boolean>>({});
    const [logoUrls, setLogoUrls] = useState<Record<string, string>>({});
    const supabase = createClient();

    useEffect(() => {
      const fetchCompanyLogos = async () => {
        // Get unique company names
        const uniqueCompanies = Array.from(
          new Set(jobs.map((job) => job.company_name))
        );

        // Fetch all logos in one query
        const { data: companies, error } = await supabase
          .from("companies")
          .select("name, logo_filename")
          .in("name", uniqueCompanies);

        if (error || !companies) {
          console.error("Error fetching logos:", error);
          return;
        }

        // Create a map of company names to their logo URLs
        const urls: Record<string, string> = {};
        companies.forEach((company) => {
          if (company.logo_filename) {
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("organization-logos")
              .getPublicUrl(company.logo_filename);
            urls[company.name] = publicUrl;
          } else {
            urls[company.name] = "/default-company-logo.png";
          }
        });

        setLogoUrls(urls);
      };

      fetchCompanyLogos();
    }, [jobs, supabase]);

    const LoadingSkeletons = () => (
      <>
        {[...Array(5)].map((_, index) => (
          <JobSkeleton key={index} />
        ))}
      </>
    );

    const formatUrl = (url: string): string => {
      if (!url) return "";
      if (!url.match(/^https?:\/\//i)) {
        return `https://${url}`;
      }
      return url;
    };

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-6 pt-3">
          {isLoading ? (
            <LoadingSkeletons />
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4 relative">
                        <Image
                          src={
                            !imageError[job.id]
                              ? logoUrls[job.company_name] ||
                                "/default-company-logo.png"
                              : "/default-company-logo.png"
                          }
                          alt={`${job.company_name} logo`}
                          width={100}
                          height={100}
                          className="rounded-lg object-contain"
                          onError={() =>
                            setImageError((prev) => ({
                              ...prev,
                              [job.id]: true,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                          {job.title}
                        </h2>
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
                    {job.visa_sponsorship && (
                      <Badge
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                      >
                        Visa Sponsorship
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(job.skills)
                      ? job.skills
                      : (job.skills as string).split(",")
                    ).map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {typeof skill === "string"
                          ? skill.replace(/["\[\]]/g, "").trim()
                          : skill}
                      </Badge>
                    ))}
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
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      asChild
                    >
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                      </a>
                    </Button>
                    {job.company_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                        asChild
                      >
                        <a
                          href={formatUrl(job.company_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Company Website
                        </a>
                      </Button>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>{getTimeAgo(job.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.jobs.length === nextProps.jobs.length &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

JobListings.displayName = "JobListings";

export default JobListings;
