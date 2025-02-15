"use client";

import ChallengeFeed from "@/components/feed/ChallengeFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ChallengeCardSkeleton from "@/components/skeleton/card/ChallengesCardSkeleton";
import { useChallengeQuery } from "@/hooks/queries/useChallengeQuery";
import React from "react";

function page() {
  const { data: challenges, isLoading, error } = useChallengeQuery();

  return (
    <>
      <WrapperLayout>
        {/* lead skeleton */}
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div className="my-4" key={idx}>
              <ChallengeCardSkeleton />
            </div>
          ))
        ) : (
          <ChallengeFeed challenges={challenges} />
        )}
      </WrapperLayout>
    </>
  );
}

export default page;
