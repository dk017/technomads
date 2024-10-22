"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  BriefcaseIcon,
  GlobeIcon,
  FilterIcon,
  ClockIcon,
  LaptopIcon,
  DollarSignIcon,
  CodeIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { jobTitleOptions } from "@/app/constants/jobTitleOptions";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import SearchableDropdown from "./SearchableDropDown";
import { title } from "node:process";
import { User } from "@supabase/supabase-js";
import { titleOptions } from "@/app/constants/titleOptions";

interface JobFiltersProps {
  user: User | null;
  isVerified: boolean;
  onFilterChange: (
    location: string,
    keywords: string,
    titleData: TitleSearchData
  ) => void;
  initialLocation: string;
  initialKeywords: string;
  initialTitle: string;
}

interface TitleSearchData {
  title: string;
  relatedJobs: string[];
  similarTitlesForMeta: string[];
}

const JobFilters: React.FC<JobFiltersProps> = ({
  user,
  isVerified,
  onFilterChange,
  initialLocation,
  initialKeywords,
  initialTitle,
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [title, setTitle] = useState(initialTitle);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [filterExperience, setFilterExperience] = useState<string>("");
  const [filterEmploymentType, setFilterEmploymentType] = useState<string>("");

  useEffect(() => {
    // Only call onFilterChange if any of the filter values have changed
    if (
      location !== initialLocation ||
      keywords !== initialKeywords ||
      title !== initialTitle
    ) {
      onFilterChange(location, keywords, {
        title,
        relatedJobs: [],
        similarTitlesForMeta: [],
      });
    }
  }, [
    location,
    keywords,
    title,
    initialLocation,
    initialKeywords,
    initialTitle,
    onFilterChange,
  ]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    const selectedTitle = jobTitleOptions.find(
      (option) => option.value === value
    );
    if (selectedTitle) {
      const titleData: TitleSearchData = {
        title: value,
        relatedJobs: selectedTitle.relatedJobs,
        similarTitlesForMeta: selectedTitle.similarTitlesForMeta,
      };
      onFilterChange(location, keywords, titleData);
    } else {
      onFilterChange(location, keywords, {
        title: value,
        relatedJobs: [],
        similarTitlesForMeta: [],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(location, keywords, {
      title,
      relatedJobs: [],
      similarTitlesForMeta: [],
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Job Title Filter */}
            <div className="flex items-center space-x-2">
              <LaptopIcon className="h-5 w-5 text-gray-400" />
              <SearchableDropdown
                options={titleOptions}
                placeholder="🏝️ Job Title"
                onSelect={handleTitleChange}
                value={title}
              />
            </div>

            {/* Location Filter */}
            <div className="flex items-center space-x-2">
              <GlobeIcon className="h-5 w-5 text-gray-400" />
              <SearchableDropdown
                options={jobLocationOptions}
                placeholder="🌎 Location"
                onSelect={handleLocationChange}
                value={location}
              />
            </div>

            {/* Keywords Filter */}
            <div className="flex items-center space-x-2">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Keywords"
                className="w-full"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e.target.value)}
              />
            </div>

            {/* Additional filters */}
            {showAllFilters && (
              <>
                {/* Salary Filter */}
                <div className="flex items-center space-x-2">
                  <DollarSignIcon className="h-5 w-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Minimum Salary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Salary</SelectItem>
                      <SelectItem value="50000">$50,000+</SelectItem>
                      <SelectItem value="75000">$75,000+</SelectItem>
                      <SelectItem value="100000">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* More/Less Filters Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowAllFilters(!showAllFilters)}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              {showAllFilters ? "Less Filters" : "More Filters"}
            </Button>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button size="lg" asChild className="mt-4">
              <Link href="/jobs">
                <SearchIcon className="mr-2 h-4 w-4" /> Search Jobs
              </Link>
            </Button>
          </div>

          {/* Unlock All Jobs and Receive Emails options */}
          {(!user || !isVerified) && (
            <div className="flex flex-wrap gap-4 p-4 justify-center">
              <Button variant="secondary" className="w-full sm:w-auto">
                🔓 Unlock All Jobs
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                🔔 Receive Emails For Remote Jobs
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobFilters;
