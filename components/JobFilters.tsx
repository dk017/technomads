import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SearchIcon,
  LaptopIcon,
  GlobeIcon,
  DollarSignIcon,
} from "lucide-react";
import { titleOptions } from "@/app/constants/titleOptions";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import SearchableDropdown from "./SearchableDropDown";
import { User } from "@supabase/supabase-js";
import debounce from "lodash/debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFiltersProps {
  onFilterChange: (
    location: string,
    keywords: string,
    title: string,
    minSalary: string
  ) => void;
  initialLocation: string;
  initialKeywords: string;
  initialTitle: string;
  initialSalary?: string;
}

const salaryRanges = [
  { label: "Any Salary", value: "0" },
  { label: "$30k+", value: "30000" },
  { label: "$50k+", value: "50000" },
  { label: "$75k+", value: "75000" },
  { label: "$100k+", value: "100000" },
  { label: "$150k+", value: "150000" },
  { label: "$200k+", value: "200000" },
];

const JobFilters: React.FC<JobFiltersProps> = memo(
  ({
    onFilterChange,
    initialLocation,
    initialKeywords,
    initialTitle,
    initialSalary = "0",
  }) => {
    const [location, setLocation] = useState(initialLocation);
    const [keywords, setKeywords] = useState(initialKeywords);
    const [title, setTitle] = useState(initialTitle);
    const [salary, setSalary] = useState(initialSalary);

    // Track if filters are being updated from props
    const isUpdatingFromProps = useRef(false);

    // Create a stable debounced filter change handler
    const debouncedFilterChange = useMemo(
      () =>
        debounce((loc: string, kw: string, t: string, sal: string) => {
          onFilterChange(loc, kw, t, sal);
        }, 500), // 500ms delay
      [onFilterChange]
    );

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        debouncedFilterChange.cancel();
      };
    }, [debouncedFilterChange]);

    // Sync with URL params
    useEffect(() => {
      isUpdatingFromProps.current = true;
      setLocation(initialLocation);
      setKeywords(initialKeywords);
      setTitle(initialTitle);
      setSalary(initialSalary);
      // Reset the flag after the state updates
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }, [initialLocation, initialKeywords, initialTitle, initialSalary]);

    const handleLocationChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setLocation(value);
          debouncedFilterChange(value, keywords, title, salary);
        }
      },
      [keywords, title, salary, debouncedFilterChange]
    );

    const handleKeywordsChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setKeywords(value);
          debouncedFilterChange(location, value, title, salary);
        }
      },
      [location, title, salary, debouncedFilterChange]
    );

    const handleTitleChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setTitle(value);
          debouncedFilterChange(location, keywords, value, salary);
        }
      },
      [location, keywords, salary, debouncedFilterChange]
    );

    const handleSalaryChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setSalary(value);
          console.log("Salary changed to:", value);
          debouncedFilterChange(location, keywords, title, value);
        }
      },
      [location, keywords, title, debouncedFilterChange]
    );

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
              <Select value={salary || "0"} onValueChange={handleSalaryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  {salaryRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JobFilters.displayName = "JobFilters";

export default JobFilters;
