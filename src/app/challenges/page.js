"use client";
import ChallengeFeed from "@/components/feed/ChallengeFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ChallengeCardSkeleton from "@/components/skeleton/card/ChallengesCardSkeleton";
import { useChallengeQuery } from "@/hooks/queries/useChallengeQuery";
import React, { useEffect, useRef } from "react";

function Page() {
  const {
    data: challenges,
    isLoading: challengesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChallengeQuery();

  return (
    <>
      <WrapperLayout>
        {/* lead skeleton */}
        {challengesLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div className="my-4" key={idx}>
              <ChallengeCardSkeleton />
            </div>
          ))
        ) : (
          <ChallengeFeed
            challenges={challenges}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </WrapperLayout>
    </>
  );
}

export default Page;
