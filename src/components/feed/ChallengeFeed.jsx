"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChallengeCard from "../cards/ChallengeCard";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useGlobalUser } from "@/context/userContent";
import BackButton from "../BackButton";
import { useEngagementMetrics } from "@/hooks/queries/usePostQuery";
import { Virtuoso } from "react-virtuoso";
import ChallengeCardSkeleton from "../skeleton/card/ChallengesCardSkeleton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function ChallengeFeed({ challenges, fetchNextPage, isFetchingNextPage }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const router = useRouter();

  // Extract challenge post IDs
  const postIds = useMemo(() => {
    if (!Array.isArray(challenges?.pages)) return [];

    return challenges.pages.flatMap((pageArray) =>
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
  }, [challenges]);
  // ----------------------Engagement Metrics ----------------------------------

  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId,
      targetType: "Challenge",
      contentType: "Challenge",
    });

  // -----------------------like Creation Logic ----------------------------------------
  const { addToBatch } = useBatchLikeMutation();

  const handleLike = useCallback(
    (postId, operation) => {
      addToBatch({
        targetId: postId,
        postIds: postIds,
        userId: userId,
        operation: operation, // "like" or "unlike"
        targetType: "Challenge",
      });
    },
    [postIds, userId, addToBatch]
  );

  const MemoizedChallengePostCard = useCallback(
    (challenge) => {
      const engagement = engagementData?.[challenge._id] || {};
      if (!challenge || challenge === null) {
        return <div></div>;
      }
      return (
        <ChallengeCard
          key={challenge?._id}
          id={challenge?._id}
          title={challenge?.challengeName}
          description={challenge?.description}
          tags={challenge?.challengeTags}
          challengeDays={challenge?.challengeDays}
          challengeOwner={challenge?.owner}
          createdAt={challenge?.createdAt}
          viewsCount={engagement.views}
          commentCount={engagement.comments}
          likesCount={engagement.likes?.count || 0}
          isLiked={engagement.likes?.isLiked || false}
          likeLoading={engagementLoading}
          onLike={() => handleLike(challenge?._id, "like")}
          onUnlike={() => handleLike(challenge?._id, "unlike")}
          optimistic={challenge.optimistic}
          isDeleting={challenge.isDeleting}
          userId={userId}
          className="mb-4"
        />
      );
    },
    [engagementData, engagementLoading, userId, handleLike]
  );
  // Check if there are no challenges
  const allChallenges = Array.isArray(challenges?.pages)
    ? challenges.pages.flatMap((pageArray) =>
        Array.isArray(pageArray)
          ? pageArray.flatMap((page) => page?.allChallenges || [])
          : []
      )
    : [];

  console.log("allChallenges", allChallenges);

  return (
    <div className="flex-1 mx-auto ">
      <BackButton />
      <div className="flex flex-col pb-4">
        {allChallenges?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-8">
            <h2 className="text-xl font-semibold mb-4">
              🚀 No Challenges Yet... Be the First!
            </h2>
            <p className=" max-w-lg mb-6">
              The feed&apos;s empty right now, but that&apos;s a perfect
              opportunity to create something epic! 💡 Whether it&apos;s a
              coding challenge 🖥️ or a dev-related task, kickstart the action
              and lead the way! 🌟
            </p>
            <Button onClick={() => router.push("/create")} variant="default">
              Create a Challenge
            </Button>
          </div>
        ) : (
          <Virtuoso
            className="mt-4"
            useWindowScroll
            data={[
              ...allChallenges,
              ...(isFetchingNextPage
                ? new Array(3).fill({ isSkeleton: true })
                : []),
            ]}
            endReached={fetchNextPage}
            overscan={500}
            itemContent={(_, challenge) =>
              challenge.isSkeleton ? (
                <ChallengeCardSkeleton />
              ) : (
                MemoizedChallengePostCard(challenge)
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default ChallengeFeed;
