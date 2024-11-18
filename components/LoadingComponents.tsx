import { FC } from "react";
import { JobSkeleton } from "@/components/JobSkeleton";

interface EndMessageProps {
  jobs: any[]; // Replace with your job type
  jobCount: number;
  showAllJobs: boolean;
}

interface LoadingIndicatorProps {
  count?: number;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ count = 3 }) => (
  <div className="mt-4 space-y-4 animate-pulse">
    {[...Array(count)].map((_, index) => (
      <JobSkeleton key={index} />
    ))}
  </div>
);

export const EndMessage: FC<EndMessageProps> = ({
  jobs,
  jobCount,
  showAllJobs,
}) => {
  const FREE_USER_LIMIT = 10; // Consider moving this to a constants file

  if (jobs.length === 0) {
    return (
      <div className="text-center p-8 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <p className="text-lg text-muted-foreground">
          No jobs found matching your criteria
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  if (!showAllJobs && jobCount > FREE_USER_LIMIT) {
    return (
      <div className="text-center p-6 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <p className="text-lg font-semibold text-primary">
          {jobCount - FREE_USER_LIMIT} more jobs available with subscription
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Upgrade to see all available positions
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-6 text-muted-foreground">
      <p className="text-sm">No more jobs to load</p>
    </div>
  );
};
