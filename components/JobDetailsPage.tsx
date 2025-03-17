import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GlobeIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingIcon,
  HomeIcon,
  ExternalLinkIcon,
  BriefcaseIcon as CompanyIcon,
} from "lucide-react";
import { Job } from "./types";

interface Company {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  size: string;
  jobCount: number;
  logo_filename: string;
}

interface JobDetailPageProps {
  job: Job;
  company: Company;
  additionalContent?: React.ReactNode;
}

const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  company,
  additionalContent,
}) => {
  const parseStringToArray = (
    str: string | string[] | null | undefined
  ): string[] => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [str];
    } catch {
      return [str];
    }
  };

  const descriptionBullets = parseStringToArray(job.job_description);
  const requirementsBullets = parseStringToArray(job.job_requirements);
  const benefitsBullets = parseStringToArray(job.job_benefits);
  const skillsArray = parseStringToArray(job.skills);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">{job.title}</h1>
        <div className="flex items-center justify-center gap-2 mb-6">
          <CompanyIcon className="h-5 w-5 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">{job.company_name}</p>
        </div>

        {/* Primary Action Button */}
        {job.job_url && (
          <Button size="lg" className="w-full max-w-md mx-auto" asChild>
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Apply for this position
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Highlights */}
          <div className="flex flex-wrap gap-3 mb-8">
            {job.country && (
              <Badge variant="outline" className="flex items-center gap-1">
                <GlobeIcon className="h-3 w-3" />
                {job.country}
              </Badge>
            )}
            {job.employment_type && (
              <Badge variant="outline" className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {job.employment_type}
              </Badge>
            )}
            {job.experience && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BriefcaseIcon className="h-3 w-3" />
                {job.experience}
              </Badge>
            )}
            {job.work_type && (
              <Badge variant="outline" className="flex items-center gap-1">
                <HomeIcon className="h-3 w-3" />
                {job.work_type}
              </Badge>
            )}
          </div>

          {/* Skills Section */}
          {skillsArray.length > 0 && (
            <Card className="bg-card/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description Card */}
          <Card className="bg-card/50">
            <CardContent className="p-6 space-y-8">
              {/* Description Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4">About the Role</h2>
                <div className="space-y-3">
                  {descriptionBullets.map((description, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground flex-1">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Requirements Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <div className="space-y-3">
                  {requirementsBullets.map((requirement, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground flex-1">
                        {requirement}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Benefits Section */}
              {benefitsBullets.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                  <div className="space-y-3">
                    {benefitsBullets.map((benefit, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="text-primary">•</span>
                        <p className="text-muted-foreground flex-1">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                  {company.size && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <BuildingIcon className="h-4 w-4 mr-2" />
                      <span>{company.size}</span>
                    </div>
                  )}
                </div>

                {company.description && (
                  <p className="text-sm text-muted-foreground text-center border-t border-border pt-4">
                    {company.description}
                  </p>
                )}

                {Array.isArray(company.tags) && company.tags.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium mb-3">Company Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag, index) => (
                        <Badge
                          key={`${company.name}-${tag}-${index}`}
                          variant="outline"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/company/${company.name}`}>
                      View All {company.jobCount} Jobs
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional content (Interview Prep CTA) will now stick with the company card */}
            {additionalContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
