"use client";

import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import { useJobs } from "@/hooks/useJobs";
import { useEffect, useState } from "react";
import { JobSkeleton } from "@/components/JobSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";

interface JobsLayoutProps {
  initialTitle?: string;
  initialLocation?: string;
  initialExperience?: string;
}

interface HeaderSectionProps {
  jobCount: number;
  title?: string;
  location?: string;
  experience?: string;
}

const HeaderSkeleton = () => (
  <section className="mb-16 text-center animate-pulse">
    <div className="h-14 w-3/4 bg-primary/10 rounded-lg mx-auto mb-4" />
    <div className="h-16 w-full max-w-3xl bg-primary/5 rounded-lg mx-auto" />
  </section>
);

const HeaderSection = ({
  jobCount,
  title,
  location,
  experience,
  isLoading,
}: HeaderSectionProps & { isLoading: boolean }) => {
  if (isLoading) {
    return <HeaderSkeleton />;
  }

  const formattedCount = jobCount.toLocaleString();

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Find the location option to get the proper display name
  const locationOption = location
    ? jobLocationOptions.find((option) => option.value === location)
    : null;

  // Format the title to always include "Remote" before the job title
  const jobTitle = title
    ? `Remote ${capitalizeWords(title.replace(/-/g, " "))}`
    : "Remote";
  const locationText = locationOption ? ` in ${locationOption.value}` : "";
  const experienceText = experience ? `${capitalizeWords(experience)} ` : "";

  return (
    <section className="mb-16 text-center">
      <h1 className="text-5xl text-primary font-semibold mb-4">
        {formattedCount} {experienceText}
        {jobTitle} Jobs{locationText}
      </h1>
      <p className="text-lg max-w-3xl mx-auto text-left">
        Explore flexible and work from home {jobTitle.toLowerCase()} positions
        available{locationText}. Your career in truly remote companies - apply
        today.
      </p>
    </section>
  );
};

export function JobsLayout({
  initialTitle,
  initialLocation,
  initialExperience,
}: JobsLayoutProps) {
  const {
    jobs,
    isLoading,
    hasMore,
    jobCount,
    fetchJobs,
    loadMoreJobs,
    setJobs,
  } = useJobs(true);

  useEffect(() => {
    fetchJobs(
      {
        title: initialTitle || "",
        location: initialLocation || "",
        experience: initialExperience || "",
        keyword: "",
        workType: "all",
        minSalary: "",
      },
      1
    );
  }, [initialTitle, initialLocation, initialExperience, fetchJobs]);

  return (
    <div className="container mx-auto px-4 py-12">
      <HeaderSection
        jobCount={jobCount}
        title={initialTitle}
        location={initialLocation}
        experience={initialExperience}
        isLoading={isLoading && jobCount === 0}
      />

      <JobFilters
        initialTitle={initialTitle || ""}
        initialLocation={initialLocation || ""}
        initialExperience={initialExperience || ""}
        initialKeywords=""
        initialSalary=""
        initialWorkType="all"
        onFilterChange={() => {}} // URL-based navigation handled in JobFilters
      />

      <div className="relative">
        {isLoading && jobs.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <JobSkeleton key={index} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={jobs.length}
            next={loadMoreJobs}
            hasMore={hasMore}
            loader={<JobSkeleton />}
            endMessage={
              <div className="text-center p-4 text-gray-400">
                {jobs.length === 0 ? "No jobs found" : "All jobs loaded"}
              </div>
            }
            scrollThreshold={0.8}
          >
            <JobListings jobs={jobs} isLoading={isLoading} />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
