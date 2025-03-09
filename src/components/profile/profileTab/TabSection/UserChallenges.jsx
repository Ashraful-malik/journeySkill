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
import Link from "next/link";

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
    if (!Array.isArray(userChallenges?.pages)) return [];
    return userChallenges.pages.flatMap((pageArray) =>
      Array.isArray(pageArray)
        ? pageArray.flatMap((page) =>
            Array.isArray(page.allChallenges)
              ? page.allChallenges
                  .map((challenge) => challenge._id)
                  .filter(Boolean)
              : []
          )
        : []
    );
  }, [userChallenges]);

  // ----------Fetch engagement metrics---------
  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId: LoginUserId,
      targetType: "Challenge",
      contentType: "Challenge",
    });

  // ------all user challenges----
  const allChallenges = useMemo(() => {
    return Array.isArray(userChallenges?.pages)
      ? userChallenges.pages.flatMap((pageArray) =>
          Array.isArray(pageArray)
            ? pageArray.flatMap((page) => page?.allChallenges || [])
            : []
        )
      : [];
  }, [userChallenges]);

  //   ----------observer for infinite scrolling-----
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
    <>
      {allChallenges?.length === 0 && (
        <div
          className="text-center text-muted-foreground  w-full 
         "
        >
          <div className="flex items-center justify-center flex-col gap-2 max-w-lg mx-auto p-4">
            <p>
              Code. Compile. Challenge. Ready to create something awesome?
              Launch your first challenge today!
            </p>
            <Link
              href="/create"
              className="px-4 bg-primary/95 py-2 rounded-sm text-sm font-semibold 
              text-primary-foreground hover:bg-primary/90"
            >
              Create a Challenge
            </Link>
          </div>
        </div>
      )}
      <Masonry
        breakpointCols={breakPointColumnsObj}
        className="flex gap-2"
        columnClassName="masonry-column"
      >
        {allChallenges?.map((challenge) => {
          const engagement = engagementData?.[challenge._id] || {};
          return (
            <div key={challenge._id} className="mb-4">
              <ChallengeCard
                title={challenge.challengeName}
                description={challenge.description}
                id={challenge._id}
                createdAt={challenge.createdAt}
                challengeOwner={userData}
                onLike={() => handleLike(challenge._id, "like")}
                onUnlike={() => handleLike(challenge._id, "unlike")}
                isDeleting={challenge.isDeleting}
                viewsCount={engagement.views || 0}
                commentCount={engagement.comments || 0}
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
    </>
  );
}

export default UserChallenges;
