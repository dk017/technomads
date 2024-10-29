"use client";

import { useState, useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "../utils/supabase/client";
import default_img from "@/public/default-company-logo.png"; // Adjust the path as needed
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CompanySkeleton } from "@/components/CompanySkeleton";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [companyCount, setCompanyCount] = useState(0);
  const itemsPerPage = 10;

  const searchParams = useSearchParams();

  const fetchCompanies = useCallback(async (page: number) => {
    try {
      const supabase = createClient();
      let query = supabase
        .from("companies")
        .select("*, tags", { count: "exact" })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      setCompanies((prevCompanies) => {
        return page === 1 ? data || [] : [...prevCompanies, ...(data || [])];
      });

      if (count !== null) {
        setCompanyCount(count);
      }

      setHasMore((data || []).length === itemsPerPage);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreCompanies = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchCompanies(currentPage + 1);
    }
  }, [fetchCompanies, hasMore, isLoading, currentPage]);

  useEffect(() => {
    fetchCompanies(1);
  }, [fetchCompanies]);

  const LoadingSkeletons = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <CompanySkeleton key={index} />
      ))}
    </>
  );

  const EndMessage = () => (
    <div className="text-center p-4 text-gray-400">
      {companies.length > 0
        ? "No more companies to load"
        : "No companies found"}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-100">
        Remote Hiring Companies
      </h1>
      <p className="text-xl text-white-600 mb-6 text-center">
        Discover opportunities beyond borders
      </p>

      {isLoading && companies.length === 0 ? (
        <LoadingSkeletons />
      ) : (
        <InfiniteScroll
          dataLength={companies.length}
          next={loadMoreCompanies}
          hasMore={hasMore}
          loader={<LoadingSkeletons />}
          endMessage={<EndMessage />}
          scrollThreshold={0.8}
          className="space-y-6"
        >
          {companies.map((company) => (
            <Card
              key={company.id}
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-4 relative">
                      <Image
                        src={company.logo_url || default_img}
                        alt={`${company.name} logo`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-100">
                      {company.name}
                    </h2>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{company.description}</p>
                <div className="flex flex-wrap gap-2">
                  {company.tags &&
                    company.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-200 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    asChild
                  >
                    <Link href={`/company/${company.name}`}>View All Jobs</Link>
                  </Button>
                  {company.website && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                      asChild
                    >
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Company Website
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
