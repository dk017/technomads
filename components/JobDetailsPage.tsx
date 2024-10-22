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
import FormattedJobDescription from "./FormattedDescription";
import { Description } from "./types";

interface Job {
  id: number;
  title: string;
  country: string;
  skills: string;
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
  formatted_description: {
    sections: {
      title: string;
      items: string[];
    }[];
  };
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

interface FormattedDescription {
  sections: { title: string; items: string[] }[];
}

// Add this utility function at the top of your file

const JobDetailPage: React.FC<JobDetailPageProps> = ({ job, company }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{job.company_name}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <GlobeIcon className="h-3 w-3 mr-1" />
            {job.country}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            {job.employment_type}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <BriefcaseIcon className="h-3 w-3 mr-1" />
            {job.experience}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {job.category}
          </Badge>
          {job.visa_sponsorship && (
            <Badge
              variant="secondary"
              className="bg-indigo-100 text-indigo-800"
            >
              Visa Sponsorship
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(job.skills)
            ? job.skills
            : (job.skills as string).split(",")
          ).map((skill: string, index) => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-black dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
              {job.description}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-black dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-3">
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={job.logo_url}
                  alt={`${job.company_name} logo`}
                  width={100}
                  height={100}
                  className="mb-2"
                />
                <h3 className="text-xl font-semibold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                  {job.company_name}
                </h3>
                <div className="flex gap-2 mt-2">
                  <a
                    href={job.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Website
                  </a>
                  <a
                    href={`/company/${encodeURIComponent(job.company_name)}`}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                  >
                    All Job Openings
                  </a>
                </div>
              </div>
              <p className="text-white-600 mb-4">{company.description}</p>
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <BuildingIcon className="h-4 w-4 mr-2" />
                <span>{company.size}</span>
              </div>

              {/* Company tags */}
              <div className="mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {company.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-teal-100 text-teal-800"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {job.company_url && (
                <Button variant="outline" className="w-full mb-4" asChild>
                  <a
                    href={job.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Company Website
                  </a>
                </Button>
              )}

              <Button className="w-full" asChild>
                <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
