"use client";
import React, { useEffect, useMemo, useRef } from "react";
import ChallengeCard from "@/components/cards/ChallengeCard";
import { useGlobalUser } from "@/context/userContent";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import Masonry from "react-masonry-css";
import { LoaderCircle } from "lucide-react";
import ChallengeCardSkeleton from "@/components/skeleton/card/ChallengesCardSkeleton";
import { useEngagementMetrics } from "@/hooks/queries/usePostQuery";

function UserChallenges({ userData }) {
  const { user } = useGlobalUser();
  const LoginUserId = user?.publicMetadata?.userId;

  const {
    data: userChallenges,
    isLoading: challengeLoading,
    hasNextPage,
    fetchNextPage,
  } = useUserChallengesQuery(userData?._id);

  const loadMoreRef = useRef(null);

  const postIds = useMemo(() => {
    return (
      userChallenges?.pages?.flatMap((page) =>
        page?.allChallenges?.map((challenge) => challenge?._id)
      ) || []
    );
  }, [userChallenges]);

  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId: LoginUserId,
      targetType: "Challenge",
      contentType: "Challenge",
    });

  //   observer for infinite scrolling
  useEffect(() => {
    if (!hasNextPage || challengeLoading) return;
    const loadMoreElement = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },

      { threshold: 0.5 }
    );
    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }
    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [hasNextPage, challengeLoading, fetchNextPage]);

  // Create like handler
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = (postId, operation) => {
    addToBatch({
      targetId: postId,
      postIds: postIds,
      userId: LoginUserId,
      operation: operation, // "like" or "unlike"
      targetType: "Challenge",
    });
  };

  // break point column object
  const breakPointColumnsObj = {
    default: 2, // 3 columns by default
    1024: 2, // 2 columns on tablets
    768: 1, // 1 column on mobile
  };

  {
    if (challengeLoading)
      return (
        <div className="flex gap-2 md:flex-nowrap flex-wrap ">
          {Array.from({ length: 2 }, (_, i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      );
  }

  return (
    <Masonry
      breakpointCols={breakPointColumnsObj}
      className="flex gap-2"
      columnClassName="masonry-column"
    >
      {userChallenges?.pages
        ?.flatMap((page) => page.allChallenges)
        ?.map((challenge) => {
          const engagement = engagementData?.[challenge._id] || {};
          return (
            <div key={challenge._id} className="mb-4">
              <ChallengeCard
                title={challenge?.challengeName}
                description={challenge?.description}
                id={challenge?._id}
                createdAt={challenge?.createdAt}
                challengeOwner={userData}
                className="max-w-sm w-full "
                onLike={() => handleLike(challenge?._id, "like")}
                onUnlike={() => handleLike(challenge?._id, "unlike")}
                optimistic={challenge.optimistic}
                isDeleting={challenge.isDeleting}
                viewsCount={engagement.views}
                commentCount={engagement.comments}
                likesCount={engagement.likes?.count || 0}
                isLiked={engagement.likes?.isLiked || false}
                likeLoading={engagementLoading}
                userId={LoginUserId}
              />
            </div>
          );
        })}
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <div
            className="flex items-center justify-center pt-8"
            aria-busy="true"
            aria-label="loading posts"
            role="status"
          >
            <span className="mr-2">
              <LoaderCircle className="animate-spin" />
            </span>{" "}
            <p className="text-sm animate-pulse" aria-hidden="true">
              Loading more challenges...
            </p>
          </div>
        </div>
      )}
    </Masonry>
  );
}

export default UserChallenges;
