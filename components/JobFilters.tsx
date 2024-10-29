import React, { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, LaptopIcon, GlobeIcon } from "lucide-react";
import { titleOptions } from "@/app/constants/titleOptions";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import SearchableDropdown from "./SearchableDropDown";
import { User } from "@supabase/supabase-js";
import debounce from "lodash/debounce";

interface JobFiltersProps {
  user: User | null;
  isVerified: boolean;
  onFilterChange: (location: string, keywords: string, title: string) => void;
  initialLocation: string;
  initialKeywords: string;
  initialTitle: string;
}

const JobFilters: React.FC<JobFiltersProps> = memo(
  ({
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

    // Debounce the filter change callback
    const debouncedFilterChange = useCallback(
      debounce((loc: string, kw: string, t: string) => {
        onFilterChange(loc, kw, t);
      }, 500),
      [onFilterChange]
    );

    // Only trigger filter change when values actually change
    useEffect(() => {
      debouncedFilterChange(location, keywords, title);
      return () => {
        debouncedFilterChange.cancel();
      };
    }, [location, keywords, title, debouncedFilterChange]);

    const handleLocationChange = useCallback((value: string) => {
      setLocation(value);
    }, []);

    const handleKeywordsChange = useCallback((value: string) => {
      setKeywords(value);
    }, []);

    const handleTitleChange = useCallback((value: string) => {
      setTitle(value);
    }, []);

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <LaptopIcon className="h-5 w-5 text-gray-400" />
              <SearchableDropdown
                options={titleOptions}
                placeholder="🏝️ Job Title"
                onSelect={handleTitleChange}
                value={title}
              />
            </div>

            <div className="flex items-center space-x-2">
              <GlobeIcon className="h-5 w-5 text-gray-400" />
              <SearchableDropdown
                options={jobLocationOptions}
                placeholder="🌎 Location"
                onSelect={handleLocationChange}
                value={location}
              />
            </div>

            <div className="flex items-center space-x-2">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Keywords"
                className="w-full"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JobFilters.displayName = "JobFilters";

export default JobFilters;
