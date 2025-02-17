"use client";

import ChallengeFeed from "@/components/feed/ChallengeFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ChallengeCardSkeleton from "@/components/skeleton/card/ChallengesCardSkeleton";
import { useChallengeQuery } from "@/hooks/queries/useChallengeQuery";
import React, { useEffect, useRef } from "react";

function page() {
  const {
    data: challenges,
    isLoading: challengesLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useChallengeQuery();

  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage || challengesLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, challengesLoading, fetchNextPage]);

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
            ref={loadMoreRef}
            hasNextPage={hasNextPage}
          />
        )}
      </WrapperLayout>
    </>
  );
}

export default page;
