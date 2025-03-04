"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PostCardSkeleton from "../card/PostCardSkeleton";

function IndividualChallengeSkeleton() {
  return (
    <div className="px-2 lg:px-0">
      {/* Back Button */}

      {/* Header Skeleton */}
      <header className="flex items-center justify-between pb-4 mt-5">
        <div className="flex items-center gap-2">
          {/* Avatar Skeleton */}
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </header>

      {/* Progress Bar Section Skeleton */}
      <div className="my-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Body Skeleton */}
      <div className="my-8">
        <div className="content">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-6 w-96 mt-2" />
          <Skeleton className="h-4 w-full mt-2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-full">
              <PostCardSkeleton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndividualChallengeSkeleton;
