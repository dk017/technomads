"use client"; // Mark this component as a Client Component

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { throttle } from "lodash";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RocketIcon,
  SearchIcon,
  BriefcaseIcon,
  GlobeIcon,
  StarIcon,
  FilterIcon,
  ClockIcon,
  BuildingIcon,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the type for a job

interface Job {
  // Add properties based on your job structure
  id: number;
  title: string;
  company: string;
  description: string;
  companySize: string;
  postedAgo: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  role: string;
}

const sortedJobs = [
  {
    id: 1,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 3,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 4,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 5,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 6,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 7,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 8,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 9,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 10,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 11,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 12,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 13,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 14,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  {
    id: 15,
    title: "Business Development Manager - Mortgages",
    company: "Neo Financial",
    companySize: "501 - 1000",
    location: "Canada - Remote",
    employmentType: "Full Time",
    experienceLevel: "Mid-level",
    role: "Business Development (BDR)",
    description:
      "Drive mortgage referral relationships for Neo's innovative mortgage offering.",
    postedAgo: "2 hours ago",
  },
  {
    id: 16,
    title: "Client Success Manager",
    company: "Another Company",
    companySize: "201 - 500",
    location: "United States - Remote",
    employmentType: "Full Time",
    experienceLevel: "Senior",
    role: "Customer Success",
    description:
      "Manage and grow relationships with key clients to ensure their success and satisfaction.",
    postedAgo: "2 hours ago",
  },
  // Add more job listings as needed
];

const imageUrls = ["/dk1.png", "/dk2.png", "/dk3.png", "/dk4.jpg", "/dk5.png"];

export default function JobPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterEmploymentType, setFilterEmploymentType] = useState("");
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const sort = searchParams.get("sort");
  const jobTitle = searchParams.get("jobTitle");
  const techStack = searchParams.get("techStack");

  const [currentPage, setCurrentPage] = useState(1);

  // Initialize the state with the correct type
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10; // Define your items per page
  const [showAll, setShowAll] = useState(false);
  const { user, isVerified } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from("jobs_nh").select("*");
      if (data) setJobs(data as Job[]); // Cast the data to Job[]
      if (error) console.error("Error fetching jobs:", error);
    };
    fetchJobs();
  }, []);

  const displayedJobs = isVerified ? sortedJobs : sortedJobs.slice(0, 10);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("jobs_nh").select("*").order("created_at");

      const { data, error } = await query.range(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage - 1
      );
      console.log("data ", data);
      if (error) {
        throw new Error(`Error fetching jobs: ${error.message}`);
      }

      //setDisplayedJobs(prevJobs => currentPage === 1 ? data : [...prevJobs, ...data]);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // This useEffect ensures that `fetchJobs` is called when the component mounts and when dependencies change.
  useEffect(() => {
    fetchJobs(); // Calling the fetchJobs function on mount or dependency change
  }, [fetchJobs]); // Using fetchJobs as the dependency, since it's already memoized with its own dependencies.

  const throttledScroll = useMemo(
    () =>
      throttle(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 &&
          !isLoading
        ) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }, 200),
    [isLoading]
  );

  const handleScroll = useCallback(() => {
    throttledScroll();
  }, [throttledScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      throttledScroll.cancel(); // Add this line to clear the throttle on unmount
    };
  }, [handleScroll, throttledScroll]);

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-6xl font-semibold mb-8 text-center">
            777 Remote Java Developer Jobs
          </h1>
          <h2 className="mx-4 mt-6 mb-6 font-regular text-2xl  text-center">
            Explore flexible and work from home devops positions available
            worldwide.
            <br></br>
            Your career in truly remote companies - apply today.
          </h2>

          <div className="mx-4 mb-8 pt-6 flex justify-center">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center">
              <div className="flex -space-x-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="rounded-full border border-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundImage: `url(${url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top", // Adjust to focus on the head
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col sm:ml-4 text-center">
                <div className="flex items-center justify-center pb-1 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundImage: "url(/star.png)",
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <span>Loved by 10,000+ remote workers</span>
              </div>
            </div>
          </div>
          <section>
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
          </section>
        </section>
      </div>
      <div className="flex flex-wrap gap-4 p-4 justify-center">
        <Input
          placeholder="Job Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="usa">USA</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Keywords" className="w-full sm:w-64" />
        <Select value={filterExperience} onValueChange={setFilterExperience}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience Levels</SelectItem>
            <SelectItem value="entry">Entry-level</SelectItem>
            <SelectItem value="mid">Mid-level</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Select
          value={filterEmploymentType}
          onValueChange={setFilterEmploymentType}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Tech Stack" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tech Stacks</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Minimum Salary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Salary</SelectItem>
            <SelectItem value="50000">$50,000+</SelectItem>
            <SelectItem value="75000">$75,000+</SelectItem>
            <SelectItem value="100000">$100,000+</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full sm:w-auto">
          <FilterIcon className="h-4 w-4 mr-2" /> More Filters
        </Button>
      </div>
      <div className="flex justify-center">
        <Button size="lg" asChild className="mt-4">
          <Link href="/jobs">
            <SearchIcon className="mr-2 h-4 w-4" /> Search Jobs
          </Link>
        </Button>
      </div>
      {/* Render your job listings here */}
      {!isVerified && jobs.length > 10 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited Job Listings</AlertTitle>
          <AlertDescription>
            You are currently viewing a limited set of job listings. Sign up and
            verify your email to access all {jobs.length} available jobs.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 pt-4">
        {displayedJobs.map((job) => (
          <Card key={job.id} className="bg-card text-card-foreground">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-muted-foreground mb-2">{job.company}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    <span>{job.companySize}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {job.postedAgo}
                </span>
              </div>
              <p className="mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  <GlobeIcon className="h-3 w-3 mr-1" />
                  {job.location}
                </Badge>
                <Badge variant="secondary">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {job.employmentType}
                </Badge>
                <Badge variant="secondary">
                  <BriefcaseIcon className="h-3 w-3 mr-1" />
                  {job.experienceLevel}
                </Badge>
                <Badge variant="secondary">{job.role}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Website</Button>
                <Button size="sm" variant="outline">
                  LinkedIn
                </Button>
                <Button size="sm" variant="outline">
                  All Job Openings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {!isVerified && jobs.length > 10 && (
        <div className="text-center mt-8">
          <p className="mb-4">
            {user
              ? "Verify your email to see all job listings!"
              : "Sign up and verify your email to see all job listings!"}
          </p>
          <Button asChild>
            <Link href={user ? "/verify-email" : "/signup"}>
              {user ? "Verify Email" : "Sign Up Now"}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
