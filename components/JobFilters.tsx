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
  HomeIcon,
  InfoIcon,
} from "lucide-react";
import { titleOptions } from "@/app/constants/titleOptions";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import SearchableDropdown from "./SearchableDropDown";
import debounce from "lodash/debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { WORK_TYPE_DESCRIPTIONS } from "./types";
import { Popover } from "@radix-ui/react-popover";
import { WORK_TYPE_OPTIONS } from "./types";
import { Card, CardContent } from "@/components/ui/card";

interface JobFiltersProps {
  onFilterChange: (
    location: string,
    keywords: string,
    title: string,
    minSalary: string,
    workType: string
  ) => void;
  initialLocation: string;
  initialKeywords: string;
  initialTitle: string;
  initialSalary?: string;
  initialWorkType?: string;
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
    initialWorkType = "all",
  }) => {
    const [location, setLocation] = useState(initialLocation);
    const [keywords, setKeywords] = useState(initialKeywords);
    const [title, setTitle] = useState(initialTitle);
    const [salary, setSalary] = useState(initialSalary);
    const [workType, setWorkType] = useState(initialWorkType);

    // Track if filters are being updated from props
    const isUpdatingFromProps = useRef(false);

    // Create a stable debounced filter change handler
    const debouncedFilterChange = useMemo(
      () =>
        debounce(
          (loc: string, kw: string, t: string, sal: string, wt: string) => {
            onFilterChange(loc, kw, t, sal, wt);
          },
          500
        ), // 500ms delay
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
          debouncedFilterChange(value, keywords, title, salary, workType);
        }
      },
      [keywords, title, salary, workType, debouncedFilterChange]
    );

    const handleKeywordsChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setKeywords(value);
          debouncedFilterChange(location, value, title, salary, workType);
        }
      },
      [location, title, salary, workType, debouncedFilterChange]
    );

    const handleTitleChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setTitle(value);
          debouncedFilterChange(location, keywords, value, salary, workType);
        }
      },
      [location, keywords, salary, workType, debouncedFilterChange]
    );

    const handleSalaryChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setSalary(value);
          console.log("Salary changed to:", value);
          debouncedFilterChange(location, keywords, title, value, workType);
        }
      },
      [location, keywords, title, workType, debouncedFilterChange]
    );

    const handleWorkTypeChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setWorkType(value);
          // Pass empty string when 'all' is selected, otherwise pass the value
          const filterValue = value === "all" ? "" : value;
          debouncedFilterChange(location, keywords, title, salary, filterValue);
        }
      },
      [location, keywords, title, salary, debouncedFilterChange]
    );

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5 text-gray-400" />
              <div className="relative flex-1">
                <Select value={workType} onValueChange={handleWorkTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-10 top-1/2 -translate-y-1/2 p-0 h-auto w-auto hover:bg-transparent"
                    >
                      <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 z-50 shadow-lg"
                    side="top"
                    align="end"
                  >
                    <Card className="bg-blue-50 dark:bg-gray-800 border-none">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Work Type Definitions
                          </h4>
                          <ul className="space-y-2">
                            {Object.entries(WORK_TYPE_DESCRIPTIONS).map(
                              ([key, desc]) => (
                                <li
                                  key={key}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                                  </div>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">{key}:</span>{" "}
                                    {desc}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JobFilters.displayName = "JobFilters";

export default JobFilters;
