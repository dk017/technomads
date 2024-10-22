import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BuildingIcon, BriefcaseIcon } from "lucide-react";

const companies = [
  {
    id: 1,
    name: "20four7VA",
    industry: "Software Development",
    jobCount: 15,
    location: "Remote",
    size: "100-500 employees",
  },
  {
    id: 2,
    name: "InnovateCo",
    industry: "Product Management",
    jobCount: 8,
    location: "Remote",
    size: "50-100 employees",
  },
  {
    id: 3,
    name: "DesignHub",
    industry: "Design",
    jobCount: 12,
    location: "Remote",
    size: "10-50 employees",
  },
  // Add more companies as needed
];

export default function CompaniesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Companies Hiring Remotely</h1>

      <div className="space-y-6">
        {companies.map((company) => (
          <Card
            key={company.id}
            className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    {company.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {company.industry}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    <span>{company.size}</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {company.location}
                </Badge>
              </div>
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-200">
                  {company.jobCount} open positions
                </span>
              </div>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link
                  href={`/company/${encodeURIComponent(
                    company.name.toLowerCase()
                  )}`}
                >
                  View Jobs
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
