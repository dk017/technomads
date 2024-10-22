import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BuildingIcon,
  GlobeIcon,
  LinkedinIcon,
  BriefcaseIcon,
} from "lucide-react";

interface CompanyProfileCardProps {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  size: string;
  jobCount: number;
}

const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({
  name,
  logo,
  description,
  tags,
  size,
  jobCount,
}) => {
  return (
    <Card className="bg-blue-50 dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
          <Image
            src={logo}
            alt={`${name} Logo`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {name}
        </h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <BuildingIcon className="h-4 w-4 mr-2" />
          <span>{size}</span>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-200">{description}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            <BriefcaseIcon className="h-3 w-3 mr-1" />
            {jobCount} open positions
          </Badge>
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <GlobeIcon className="h-4 w-4 mr-2" />
            Website
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
          >
            <LinkedinIcon className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyProfileCard;
