import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GlobeIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingIcon,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  country: string;
  skills: string | string[];
  visa_sponsorship: boolean;
  company_name: string;
  company_size: string;
  employment_type: string;
  salary: string;
  logo_url: string;
  job_url: string;
  short_description: string;
  description: string;
  category: string;
  company_url: string;
  experience: string;
  city: string;
  job_slug: string;
  job_description: string[];
  job_requirements: string[];
  job_benefits: string[];
}

interface Company {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  size: string;
  jobCount: number;
}

interface JobDetailPageProps {
  job: Job;
  company: Company;
}

const JobDetailPage: React.FC<JobDetailPageProps> = ({ job, company }) => {
  // Parse skills if they're a string
  const parseStringToArray = (
    str: string | string[] | null | undefined
  ): string[] => {
    if (!str) return [];
    if (Array.isArray(str)) return str;

    try {
      // If it's a string representation of an array, parse it
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [str];
    } catch {
      // If parsing fails, return the string as a single item array
      return [str];
    }
  };

  const descriptionBullets = parseStringToArray(job.job_description);
  const requirementsBullets = parseStringToArray(job.job_requirements);
  const benefitsBullets = parseStringToArray(job.job_benefits);
  const skillsArray = parseStringToArray(job.skills);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">{job.company_name}</p>

        {/* Job Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.country && (
            <Badge variant="secondary">
              <GlobeIcon className="h-3 w-3 mr-1" />
              {job.country}
            </Badge>
          )}
          {job.employment_type && (
            <Badge variant="secondary">
              <ClockIcon className="h-3 w-3 mr-1" />
              {job.employment_type}
            </Badge>
          )}
          {job.experience && (
            <Badge variant="secondary">
              <BriefcaseIcon className="h-3 w-3 mr-1" />
              {job.experience}
            </Badge>
          )}
          {job.category && <Badge variant="secondary">{job.category}</Badge>}
          {job.visa_sponsorship && (
            <Badge variant="secondary">Visa Sponsorship</Badge>
          )}
        </div>

        {/* Skills Section */}
        {skillsArray.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skillsArray.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Description */}
        <div className="lg:col-span-2">
          <Card className="mt-6">
            <CardContent className="p-6 space-y-8">
              {/* Description Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
                <div className="space-y-2">
                  {descriptionBullets.map((description, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                <div className="space-y-2">
                  {requirementsBullets.map((requirement, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground">{requirement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Section */}
              {benefitsBullets.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                  <div className="space-y-2">
                    {benefitsBullets.map((benefit, index) => (
                      <div key={index} className="flex items-baseline gap-2">
                        <span className="text-primary">•</span>
                        <p className="text-muted-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 mb-4">
                  <Image
                    src="/default-company-logo.png"
                    alt={`${job.company_name} logo`}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {job.company_name}
                </h3>

                {/* Company Size */}
                {company.size && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    <span>{company.size}</span>
                  </div>
                )}

                {/* Company Description */}
                {company.description && (
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {company.description}
                  </p>
                )}

                {/* Company Tags */}
                {company.tags?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {company.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="w-full space-y-3">
                  {job.company_url && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={job.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Company Website
                      </a>
                    </Button>
                  )}
                  {job.job_url && (
                    <Button className="w-full" asChild>
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
