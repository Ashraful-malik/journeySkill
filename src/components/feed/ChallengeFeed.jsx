"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChallengeCard from "../cards/ChallengeCard";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useGlobalUser } from "@/context/userContent";
import BackButton from "../BackButton";
import { useEngagementMetrics } from "@/hooks/queries/usePostQuery";
import { Virtuoso } from "react-virtuoso";
import ChallengeCardSkeleton from "../skeleton/card/ChallengesCardSkeleton";

function ChallengeFeed({ challenges, fetchNextPage, isFetchingNextPage }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;

  // Extract challenge post IDs
  const postIds = useMemo(() => {
    return (
      challenges?.pages?.flatMap((page) =>
        page?.allChallenges?.map((challenge) => challenge?._id)
      ) || []
    );
  }, [challenges]);
  // --------------Loading likes vies and comments-------------------------

  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId,
      targetType: "Challenge",
      contentType: "Challenge",
    });

  // -----------------------like Creation Logic ----------------------------------------
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = (postId, operation) => {
    addToBatch({
      targetId: postId,
      postIds: postIds,
      userId: userId,
      operation: operation, // "like" or "unlike"
      targetType: "Challenge",
    });
  };
  const MemoizedChallengePostCard = useCallback(
    (challenge) => {
      const engagement = engagementData?.[challenge._id] || {};
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
          viewCount={engagement.views}
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
    [engagementData]
  );

  return (
    <div className="flex-1 mx-auto ">
      <BackButton />
      <div className="flex flex-col pb-4">
        <Virtuoso
          className="mt-4"
          useWindowScroll
          data={[
            ...(challenges?.pages?.flatMap((page) =>
              page.allChallenges.map((challenge) => challenge)
            ) || []),
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
      </div>
    </div>
  );
}

export default ChallengeFeed;
