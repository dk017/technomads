"use client";

import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import JobExplorationSection from "@/components/JobExplorationSection";
import { useJobSearch } from "@/hooks/UseJobSearch";
import FAQSection from "@/components/FAQ";
import { BriefcaseIcon, RocketIcon, GlobeIcon } from "lucide-react";

const imageUrls = ["/dk1.png", "/dk2.png", "/dk3.png", "/dk4.jpg", "/dk5.png"];

export default function Home() {
  const { user, isVerified } = useAuth();
  const { jobs, loading, queryParams, handleFilterChange } = useJobSearch();

  return (
    <>
      {/* ... (keep the existing JSX for the header section) */}
      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-6xl font-semibold mb-8 text-center">
            Find Your Dream Remote Job
          </h1>
          <h2 className="mx-4 mt-6 mb-6 font-regular text-2xl  text-center">
            Search 43,426 work from home jobs and get more job interviews
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <RocketIcon className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Launch Your Career</h3>
              <p className="text-muted-foreground">
                Find the perfect remote job to take your career to new heights
              </p>
            </div>
            <div className="text-center">
              <GlobeIcon className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Work from Anywhere</h3>
              <p className="text-muted-foreground">
                Enjoy the flexibility of working from home or anywhere in the
                world
              </p>
            </div>
            <div className="text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Quality Opportunities
              </h3>
              <p className="text-muted-foreground">
                Access top remote jobs from leading companies worldwide
              </p>
            </div>
          </div>
        </section>
        <JobExplorationSection />
        <JobFilters
          user={user}
          isVerified={isVerified}
          onFilterChange={(location, keyword, titleData) => {
            handleFilterChange({
              location,
              keyword,
              title: titleData.title,
            });
          }}
          initialLocation={queryParams.location}
          initialKeywords={queryParams.keyword}
          initialTitle={queryParams.title}
        />
        <JobListings jobs={jobs} isVerified={isVerified} user={user} />
        <FAQSection />
        {loading && <p>Loading jobs...</p>}
      </div>
    </>
  );
}
