"use client";

import { useAuth } from "@/components/AuthContext";
import JobFilters from "@/components/JobFilters";
import JobListings from "@/components/JobListings";
import JobExplorationSection from "@/components/JobExplorationSection";
import { usePathname, useSearchParams } from "next/navigation";
import FAQSection from "@/components/FAQ";
import { BriefcaseIcon, RocketIcon, GlobeIcon } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { JobSkeleton } from "@/components/JobSkeleton";

const imageUrls = ["/dk1.png", "/dk2.png", "/dk3.png", "/dk4.jpg", "/dk5.png"];
interface FilterParams {
  location: string;
  keyword: string;
  title: string;
  category?: string;
}

const ITEMS_PER_PAGE = 10;
const FREE_USER_LIMIT = 10;

export default function Home() {
  const { user, isLoading: authLoading } = useAuth() || {};
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filters, setFilters] = useState<FilterParams>({
    location: "",
    keyword: "",
    title: "",
  });

  const [isSubscribed, setIsSubscribed] = useState(false); // Add this
  const {
    jobs,
    isLoading,
    jobCount,
    fetchJobs,
    hasMore,
    loadMoreJobs,
    isLoadingMore,
  } = useJobs(isSubscribed);
  // Add subscription check
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      setIsSubscribed(data?.status === "active");
    };

    checkSubscription();
  }, [user]);

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: FilterParams) => {
        const updatedSearchParams = new URLSearchParams(
          searchParams.toString()
        );
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            updatedSearchParams.set(key, value.toString());
          } else {
            updatedSearchParams.delete(key);
          }
        });

        router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
          scroll: false,
        });
      }, 500),
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    async (location: string, keywords: string, title: string) => {
      const newFilters: FilterParams = { location, keyword: keywords, title };

      try {
        await Promise.all([
          fetchJobs(newFilters, 1, true),
          new Promise((resolve) => {
            debouncedUpdateURL(newFilters);
            setTimeout(resolve, 500);
          }),
        ]);
      } catch (error) {
        console.error("Error updating filters:", error);
      }

      setFilters(newFilters);
    },
    [fetchJobs, debouncedUpdateURL]
  );

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
        {/* <JobFilters
          user={user ?? null}
          isVerified={!!user?.email_confirmed_at}
          onFilterChange={(location, keyword, title) => {
            handleFilterChange({
              location,
              keyword,
              title,
            });
          }}
          initialLocation={queryParams?.location ?? ""}
          initialKeywords={queryParams?.keyword ?? ""}
          initialTitle={queryParams?.title ?? ""}
        /> */}
        <JobFilters
          user={user ?? null}
          isVerified={!!user?.email_confirmed_at}
          onFilterChange={handleFilterChange}
          initialLocation={filters.location}
          initialKeywords={filters.keyword}
          initialTitle={filters.title}
        />

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
            hasMore={isSubscribed ? hasMore : jobs.length < FREE_USER_LIMIT}
            loader={
              isLoadingMore && (
                <div className="mt-4 space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <JobSkeleton key={index} />
                  ))}
                </div>
              )
            }
            endMessage={
              <div className="text-center p-4 text-gray-400">
                {jobs.length === 0
                  ? "No jobs found matching your criteria"
                  : !isSubscribed && jobCount > FREE_USER_LIMIT
                  ? `${
                      jobCount - FREE_USER_LIMIT
                    } more jobs available with subscription`
                  : "No more jobs to load"}
              </div>
            }
            scrollThreshold={0.8}
            className="space-y-6"
          >
            <JobListings
              jobs={jobs}
              isVerified={!!user?.email_confirmed_at}
              user={user ?? null}
              isLoading={isLoading}
            />
          </InfiniteScroll>
        )}

        {!isSubscribed && jobCount > FREE_USER_LIMIT && (
          <div className="relative">
            <div
              className="absolute -top-40 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background z-10"
              aria-hidden="true"
            />
            <div className="relative z-20">
              <div className="text-center mb-8">
                <p className="text-2xl font-bold text-primary">
                  +{jobCount - FREE_USER_LIMIT} More Jobs Available!
                </p>
                <p className="text-xl text-primary mt-2">
                  Subscribe now to unlock all job opportunities
                </p>
              </div>
            </div>
          </div>
        )}
        <FAQSection />
      </div>
    </>
  );
}
