"use client";

import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchX } from "lucide-react";

interface Company {
  id: string;
  name: string;
  description: string;
  size: string;
  tags: string[];
  job_count: number;
}

interface Filters {
  search: string;
  size: string;
  minJobs: string;
}

const PAGE_SIZE = 10;

const CompanyCardSkeleton = () => (
  <div className="bg-card/50 border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-card/80">
    <div className="flex flex-col space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);

const CompanyCard = ({ company }: { company: Company }) => (
  <Link href={`/company/${company.name}`}>
    <div className="group bg-card/50 border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-card/80">
      <div className="flex flex-col space-y-4">
        {/* Company Name and Details */}
        <div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {company.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {company.size || "Size not specified"}
            </span>
            <Badge variant="secondary">
              {company.job_count} open positions
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {company.description || "No description available"}
        </p>

        {/* Tags */}
        {Array.isArray(company.tags) && company.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {company.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${company.id}-${tag}-${index}`}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </Link>
);

const FiltersSection = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) => (
  <div className="flex flex-col md:flex-row gap-4 mb-8">
    <Input
      placeholder="Search companies..."
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      className="flex-1"
    />
    <Select
      value={filters.size}
      onValueChange={(value) => setFilters({ ...filters, size: value })}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Company size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All sizes</SelectItem>
        <SelectItem value="1-10">1-10</SelectItem>
        <SelectItem value="11-50">11-50</SelectItem>
        <SelectItem value="51-200">51-200</SelectItem>
        <SelectItem value="201-500">201-500</SelectItem>
        <SelectItem value="501-1000">501-1000</SelectItem>
        <SelectItem value="1000+">1000+</SelectItem>
      </SelectContent>
    </Select>
    <Select
      value={filters.minJobs}
      onValueChange={(value) => setFilters({ ...filters, minJobs: value })}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Min. open positions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Any</SelectItem>
        <SelectItem value="1">At least 1</SelectItem>
        <SelectItem value="5">At least 5</SelectItem>
        <SelectItem value="10">At least 10</SelectItem>
        <SelectItem value="20">At least 20</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const useIntersectionObserver = (callback: () => void, deps: any[] = []) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const currentElement = useRef<Element | null>(null);

  useEffect(() => {
    if (observer.current) {
      if (currentElement.current) {
        observer.current.unobserve(currentElement.current);
      }
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1.0 }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback, ...deps]);

  const ref = useCallback((element: Element | null) => {
    if (element) {
      if (currentElement.current) {
        if (observer.current) {
          observer.current.unobserve(currentElement.current);
        }
      }
      currentElement.current = element;
      if (observer.current) {
        observer.current.observe(element);
      }
    }
  }, []);

  return ref;
};

const NoResultsFound = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
    <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
    <p className="text-muted-foreground text-center max-w-md mb-6">
      We could not find any companies matching your search criteria. Try
      adjusting your filters or search terms.
    </p>
    <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
      <p>Suggestions:</p>
      <ul className="list-disc pl-5">
        <li>Check for spelling errors</li>
        <li>Try using broader search terms</li>
        <li>Remove some filters</li>
        <li>Try different company sizes</li>
      </ul>
    </div>
  </div>
);

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    size: "all",
    minJobs: "all",
  });

  // Last element ref for infinite scroll
  const lastCompanyRef = useRef<HTMLDivElement>(null);
  const infiniteScrollRef = useIntersectionObserver(() => {
    if (hasMore && !loading) {
      fetchCompanies(companies.length);
    }
  }, [hasMore, loading, companies.length]);

  const fetchCompanies = useCallback(
    async (start = 0) => {
      const supabase = createClient();
      let query = supabase
        .from("companies")
        .select("*", { count: "exact" })
        .order("name")
        .range(start, start + PAGE_SIZE - 1);

      // Apply filters
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }
      if (filters.size && filters.size !== "all") {
        query = query.eq("size", filters.size);
      }
      if (filters.minJobs && filters.minJobs !== "all") {
        query = query.gte("job_count", parseInt(filters.minJobs));
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching companies:", error);
        return;
      }

      if (start === 0) {
        setCompanies(data || []);
      } else {
        setCompanies((prev) => [...prev, ...(data || [])]);
      }

      setHasMore((count || 0) > start + PAGE_SIZE);
      setLoading(false);
    },
    [filters]
  );

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchCompanies(0);
  }, [filters, fetchCompanies]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl text-primary font-semibold mb-4 text-center">
        Remote Hiring Companies
      </h1>

      <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1"
          />
          <Select
            value={filters.size}
            onValueChange={(value) => setFilters({ ...filters, size: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              <SelectItem value="1-10">1-10</SelectItem>
              <SelectItem value="11-50">11-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
              <SelectItem value="501-1000">501-1000</SelectItem>
              <SelectItem value="1000+">1000+</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.minJobs}
            onValueChange={(value) =>
              setFilters({ ...filters, minJobs: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Min. open positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">At least 1</SelectItem>
              <SelectItem value="5">At least 5</SelectItem>
              <SelectItem value="10">At least 10</SelectItem>
              <SelectItem value="20">At least 20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <div
                key={company.id}
                ref={
                  index === companies.length - 1 ? infiniteScrollRef : undefined
                }
              >
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <NoResultsFound />
        )}
      </div>
    </div>
  );
}
