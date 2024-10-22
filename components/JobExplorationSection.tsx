import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Code,
  LineChart,
  Megaphone,
  Paintbrush,
  Calculator,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface JobCategoryCardProps {
  title: string;
  description: string;
  jobCount: number;
  icon: LucideIcon;
  slug: string; // Add this new prop for the URL slug
}

const JobCategoryCard: React.FC<JobCategoryCardProps> = ({
  title,
  description,
  jobCount,
  icon: Icon,
  slug,
}) => (
  <Card className="bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-750">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-blue-600 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-6">{description}</p>
      <Link href={`/jobs/${slug}`} passHref>
        <Button
          variant="ghost"
          className="text-blue-400 hover:text-blue-300 p-0 mt-auto"
        >
          View {jobCount} jobs <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const JobExplorationSection = () => {
  const jobCategories = [
    {
      title: "Remote developer jobs",
      description:
        "Explore remote jobs for software engineers, full-stack developers, and more.",
      jobCount: 1234,
      icon: Code,
      slug: "developer",
    },
    {
      title: "Remote sales jobs",
      description:
        "Discover remote opportunities in sales, business development, and account management.",
      jobCount: 567,
      icon: Briefcase,
      slug: "sales",
    },
    {
      title: "Remote product jobs",
      description:
        "Find remote roles in product management, UX/UI design, and product marketing.",
      jobCount: 890,
      icon: LineChart,
      slug: "product",
    },
    {
      title: "Remote marketing jobs",
      description:
        "Explore remote jobs at companies like Passport, Brilliant.org, and Jeeves",
      jobCount: 678,
      icon: Megaphone,
      slug: "marketing",
    },
    {
      title: "Remote design jobs",
      description:
        "Explore remote jobs at companies like Space Inch, Black Spectacles, and Salesforce",
      jobCount: 456,
      icon: Paintbrush,
      slug: "design",
    },
    {
      title: "Remote finance jobs",
      description:
        "Explore remote jobs at companies like KMS Technology, Deel, and Zuora",
      jobCount: 345,
      icon: Calculator,
      slug: "finance",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="mb-6 md:mb-0">
          <h1 className="text-4xl font-bold mb-3 text-gray-100">
            Explore 40,000+ remote job opportunities
          </h1>
          <p className="text-xl text-gray-400">
            Personalized filters make it quick and easy to find the jobs you
            care about.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Link href="/jobs">Search all jobs</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobCategories.map((category, index) => (
          <JobCategoryCard key={index} {...category} />
        ))}
      </div>
    </div>
  );
};

export default JobExplorationSection;
