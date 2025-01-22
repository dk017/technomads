"use client";

import { JobsLayout } from "@/components/JobsLayout";

interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  minSalary?: string;
}

export default function Home() {
  return <JobsLayout />; // Will show all jobs without filters
}

// Header Section Component
const HeaderSection = ({
  formattedJobCount,
}: {
  formattedJobCount: string;
}) => (
  <section className="mb-16">
    <h1 className="text-6xl font-semibold mb-8 text-center">
      Find Your Dream Remote Job
    </h1>
    <h2 className="mx-4 mt-6 mb-6 font-regular text-2xl text-center">
      Search {formattedJobCount} work from home jobs and get more job interviews
    </h2>
  </section>
);
