import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileDetailsSkeleton() {
  return (
    <section className="mt-5 px-2 lg:px-0 space-y-5">
      {/* Banner Skeleton */}
      <Skeleton className="h-[150px] w-full rounded-lg" />

      {/* Profile Header Skeleton */}
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <Skeleton className="h-[80px] w-[80px] rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex space-x-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Bio Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Profile Tab Skeleton */}
      <div className="mt-8 space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </section>
  );
}

export default ProfileDetailsSkeleton;
