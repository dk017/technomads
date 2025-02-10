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
  BriefcaseIcon,
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
import { useRouter } from "next/navigation";
import { generateSlug } from "@/utils/url";
import { EXPERIENCE_LEVELS } from "@/app/constants/jobFilters";

interface JobFiltersProps {
  onFilterChange: (
    location: string,
    keywords: string,
    title: string,
    minSalary: string,
    workType: string,
    experience?: string
  ) => void;
  initialLocation: string;
  initialKeywords: string;
  initialTitle: string;
  initialSalary?: string;
  initialWorkType?: string;
  initialExperience?: string;
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
    initialExperience = "",
  }) => {
    const [location, setLocation] = useState(initialLocation);
    const [keywords, setKeywords] = useState(initialKeywords);
    const [title, setTitle] = useState(initialTitle);
    const [salary, setSalary] = useState(initialSalary);
    const [workType, setWorkType] = useState(initialWorkType);
    const [experience, setExperience] = useState(initialExperience || "any");
    const [isSearching, setIsSearching] = useState(false);

    // Track if filters are being updated from props
    const isUpdatingFromProps = useRef(false);

    // Create a stable debounced filter change handler
    const debouncedFilterChange = useMemo(
      () =>
        debounce(
          (
            loc: string,
            kw: string,
            t: string,
            sal: string,
            wt: string,
            exp: string
          ) => {
            if (!isSearching) {
              onFilterChange(loc, kw, t, sal, wt, exp);
            }
          },
          500
        ), // 500ms delay
      [onFilterChange, isSearching]
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
      setExperience(initialExperience);
      // Reset the flag after the state updates
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }, [
      initialLocation,
      initialKeywords,
      initialTitle,
      initialSalary,
      initialExperience,
    ]);

    const router = useRouter();

    const handleTitleSelect = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setTitle(value);
          setIsSearching(false);

          // Find the title option to get the correct value
          const titleOption = titleOptions.find(
            (option) => option.label === value
          );

          const params = {
            title: titleOption?.value || "", // Use value instead of label
            location,
            experience,
          };

          onFilterChange(
            location,
            keywords,
            titleOption?.value || "", // Use value for filtering
            salary,
            workType,
            experience === "any" ? "" : experience
          );

          const url = generateSlug(params);
          router.push(url);
        }
      },
      [location, experience, router, keywords, salary, workType, onFilterChange]
    );

    const handleTitleInput = useCallback((value: string) => {
      setTitle(value);
      setIsSearching(true);
    }, []);

    const handleLocationChange = useCallback(
      (selectedLocation: string) => {
        if (!isUpdatingFromProps.current) {
          // Find the selected location option to get its value
          const locationOption = jobLocationOptions.find(
            (option) => option.label === selectedLocation
          );

          setLocation(selectedLocation);

          const params = {
            title,
            location: locationOption?.slug || "", // Use slug instead of value for URL
            experience,
          };

          // Pass the value to the filter change handler
          onFilterChange(
            locationOption?.value || "", // Use value for filtering
            keywords,
            title,
            salary,
            workType,
            experience === "any" ? "" : experience
          );

          const url = generateSlug(params);
          router.push(url);
        }
      },
      [title, experience, router, keywords, salary, workType, onFilterChange]
    );

    const handleKeywordsChange = useCallback(
      (value: string) => {
        setKeywords(value);
        onFilterChange(
          location,
          value,
          title,
          salary,
          workType,
          experience === "any" ? "" : experience
        );
      },
      [location, title, salary, workType, experience, onFilterChange]
    );

    const handleTitleChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setTitle(value);
          debouncedFilterChange(
            location,
            keywords,
            value,
            salary,
            workType,
            experience
          );
        }
      },
      [location, keywords, salary, workType, experience, debouncedFilterChange]
    );

    const handleSalaryChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setSalary(value);
          debouncedFilterChange(
            location,
            keywords,
            title,
            value,
            workType,
            experience
          );
        }
      },
      [location, keywords, title, workType, experience, debouncedFilterChange]
    );

    const handleWorkTypeChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setWorkType(value);
          // Pass empty string when 'all' is selected, otherwise pass the value
          const filterValue = value === "all" ? "" : value;
          debouncedFilterChange(
            location,
            keywords,
            title,
            salary,
            filterValue,
            experience
          );
        }
      },
      [location, keywords, title, salary, experience, debouncedFilterChange]
    );

    const handleLocationInput = useCallback((value: string) => {
      setLocation(value);
    }, []);

    const handleExperienceChange = useCallback(
      (value: string) => {
        if (!isUpdatingFromProps.current) {
          setExperience(value);
          const filterValue = value === "any" ? "" : value;

          const params = {
            title,
            location,
            experience: filterValue,
          };

          const url = generateSlug(params);
          router.push(url);
        }
      },
      [title, location, router]
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
                onSelect={handleTitleSelect}
                onInput={handleTitleInput}
                value={title}
              />
            </div>

            <div className="flex items-center space-x-2">
              <GlobeIcon className="h-5 w-5 text-gray-400" />
              <SearchableDropdown
                options={jobLocationOptions}
                placeholder="🌎 Location"
                onSelect={handleLocationChange}
                onInput={handleLocationInput}
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
            <div className="flex items-center space-x-2 pb-2">
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              <Select value={experience} onValueChange={handleExperienceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
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
