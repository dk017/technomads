import { Card, CardContent } from "@/components/ui/card";

export function CompanySkeleton() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 animate-pulse"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
