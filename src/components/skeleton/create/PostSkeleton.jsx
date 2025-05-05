import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function PostSkeleton() {
  return (
    <Card className="w-full  mx-auto mt-8 rounded-2xl shadow-md">
      <CardContent className="space-y-6">
        {/* Challenge Selector */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Post Content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        {/* Link Input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        {/* Public Toggle */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Skeleton className="h-10 w-32 rounded-full mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

export default PostSkeleton;
