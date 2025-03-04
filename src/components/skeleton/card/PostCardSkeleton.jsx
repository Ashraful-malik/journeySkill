import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function PostCardSkeleton() {
  return (
    <div className="border rounded-none p-4 w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* profile details */}
        <div className="flex items-center space-x-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        {/* dropdown menu */}
        <Skeleton className="w-12 h-6" />
      </div>

      {/* Content */}
      <div className="mt-4">
        <Skeleton className="w-full h-64" />
        <div className="mt-4">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-1/2 h-5 mt-2" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          {/* Left Actions */}
          <div className="flex items-center space-x-4 text-muted-foreground">
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-16 h-6" />
          </div>
          {/* Right side Action */}
          <Skeleton className="w-16 h-6" />
        </div>
      </div>
    </div>
  );
}

export default PostCardSkeleton;
