import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ChallengeCardSkeleton() {
  return (
    <div className="rounded-sm border shadow-sm p-4 space-y-4 w-full ">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        {/* Profile and Name */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
        {/* Dropdown Menu */}
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Date Skeleton */}
      <Skeleton className="h-3 w-[100px]" />

      {/* Content Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-4 w-[60px]" />
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between">
        {/* Left Actions */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-6" />
        </div>
      </div>
    </div>
  );
}

export default ChallengeCardSkeleton;
