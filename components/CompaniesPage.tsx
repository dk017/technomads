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
import { createClient } from "@/app/utils/supabase/client";

interface CompanyProfileCardProps {
  name: string;
  logo: string;
  description: string;
  tags: string[];
  size: string;
  jobCount: number;
  org_url: string;
}

const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({
  name,
  logo,
  description,
  tags,
  size,
  jobCount,
  org_url,
}) => {
  const supabase = createClient();
  const logoUrl = logo
    ? supabase.storage.from("organization-logos").getPublicUrl(logo).data
        ?.publicUrl
    : null;
  return (
    <Card className="bg-blue-50 dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="space-y-4">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`${name} Logo`}
              width={80}
              height={80}
              className="rounded-lg object-contain mx-auto"
            />
          )}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {name}
          </h2>
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <BuildingIcon className="h-4 w-4 mr-2" />
            <span>{size}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-200">{description}</p>
          <div className="flex flex-wrap justify-center gap-2">
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
          {org_url && (
            <div className="flex justify-center">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open(org_url, "_blank")}
              >
                <GlobeIcon className="h-4 w-4 mr-2" />
                Website
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyProfileCard;
