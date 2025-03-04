import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function ChallengeAnalyticsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-0">
      {/* Title */}
      <div className="mb-8">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Overview Skeleton */}
      <section className="mb-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-3 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Progress Skeleton */}
      <section className="mb-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </section>

      {/* Activity Heatmap Skeleton */}
      <section className="mb-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Card className="pt-4">
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </section>

      {/* Challenge Details Skeleton */}
      <section className="mb-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Insights Skeleton */}
      <section>
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Card>
          <CardContent className="pt-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default ChallengeAnalyticsSkeleton;
