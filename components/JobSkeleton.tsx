import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function JobSkeleton() {
  return (
    <div className="pt-6 max-w-5xl mx-auto">
      <Card className="bg-white dark:bg-gray-800 shadow-md w-full">
        <CardContent className="p-6">
          <div className="flex items-start mb-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
