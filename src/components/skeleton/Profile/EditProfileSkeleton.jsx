"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function EditProfileSkeleton() {
  return (
    <div className="p-6 w-full mx-auto">
      {/* Banner */}
      <Skeleton className="w-full h-32 rounded-md" />

      {/* Profile Picture */}
      <div className="flex  -mt-12">
        <Skeleton className="w-24 h-24 rounded-full " />
      </div>

      {/* Username */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 " />
      </div>

      {/* Full Name */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 " />
      </div>

      {/* Bio */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 " />
      </div>

      {/* Country */}
      <div className="mt-4">
        <Skeleton className="h-9 " />
      </div>

      {/* Date of Birth */}
      <div className="mt-4">
        <Skeleton className="h-9 " />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4 float-right">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}

export default EditProfileSkeleton;
