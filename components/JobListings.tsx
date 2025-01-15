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
        const uniqueCompanies = Array.from(
          new Set(jobs.map((job) => job.company_name))
        );

        const { data: companies, error } = await supabase
          .from("companies")
          .select("name, logo_filename")
          .in("name", uniqueCompanies);

        if (error || !companies) {
          console.error("Error fetching logos:", error);
          return;
        }

        // Only set URLs for companies that have a logo_filename
        const urls: Record<string, string> = {};
        companies.forEach((company) => {
          if (company.logo_filename) {
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("organization-logos")
              .getPublicUrl(company.logo_filename);
            urls[company.name] = publicUrl;
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
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start">
                      {logoUrls[job.company_name] && !imageError[job.id] && (
                        <div className="w-16 h-16 mr-4 relative">
                          <Image
                            src={logoUrls[job.company_name]}
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
                      )}
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                          {job.title}
                        </h2>
                        <Link
                          href={`/company/${job.company_name}`}
                          className="inline-block text-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          aria-label={`View ${job.company_name}'s profile`}
                        >
                          {job.company_name}
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <BuildingIcon className="h-4 w-4 mr-2" />
                          <span>{job.company_size}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">
                      {job.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2">
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
                      {job.visa_sponsorship && (
                        <Badge
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                        >
                          Visa Sponsorship
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(typeof job.skills === "string"
                        ? job.skills.split(",")
                        : Array.isArray(job.skills)
                        ? job.skills
                        : []
                      )
                        .slice(0, 5)
                        .map((skill: string, index: number) => (
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
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{job.city}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <Link
                          href={`/${generateSlug(job.company_name)}/jobs/${
                            job.job_slug
                          }`}
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
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-auto">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{getTimeAgo(job.created_at)}</span>
                      </div>
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
