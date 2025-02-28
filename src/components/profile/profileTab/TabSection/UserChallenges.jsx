"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChallengeCard from "@/components/cards/ChallengeCard";
import { useGlobalUser } from "@/context/userContent";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import Masonry from "react-masonry-css";
import { useGetLikesQuery } from "@/hooks/queries/useLikesQuery";
import { useViewsQuery } from "@/hooks/queries/useViewQuery";
import { useCountCommentsQuery } from "@/hooks/queries/useCommentQuery";
import { LoaderCircle } from "lucide-react";
import { isEqual } from "lodash";
import ChallengeCardSkeleton from "@/components/skeleton/card/ChallengesCardSkeleton";

function UserChallenges({ userData }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const [cachedViewsMap, setCachedViewsMap] = useState({});
  const [cachedLikesMap, setCachedLikesMap] = useState({});
  const [cachedCommentCountMap, setCachedCommentCountMap] = useState({});

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

  // Batch fetch views only for new post IDs
  const { data: viewsMap = {}, isLoading: viewsLoading } = useViewsQuery({
    postIds: postIds,
    contentType: "Challenge",
  });

  // Batch fetch likes
  const { data: likesMap = {}, isLoading: likesLoading } = useGetLikesQuery({
    paginatedPosts: userChallenges,
    userId: userId,
    targetType: "Challenge",
    postIds: postIds,
  });

  // Get comment count
  const { data: commentCountMap = {}, isLoading: commentCountLoading } =
    useCountCommentsQuery({
      postIds: postIds,
      targetType: "challenge",
    });

  // update cached views
  useEffect(() => {
    if (viewsLoading || isEqual(viewsMap, cachedViewsMap)) return;
    setCachedViewsMap((prev) => ({ ...prev, ...viewsMap }));
  }, [viewsMap, viewsLoading]);

  // Update cached likes
  useEffect(() => {
    if (likesLoading || isEqual(likesMap, cachedLikesMap)) return;
    setCachedLikesMap((prev) => ({ ...prev, ...likesMap }));
  }, [likesMap, likesLoading]);

  // Update cached comments
  useEffect(() => {
    if (commentCountLoading || isEqual(commentCountMap, cachedCommentCountMap))
      return;
    setCachedCommentCountMap((prev) => ({ ...prev, ...commentCountMap }));
  }, [commentCountMap, commentCountLoading]);

  //   observer for infinite scrolling
  useEffect(() => {
    if (!hasNextPage || challengeLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },

      { threshold: 0.5 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, challengeLoading, fetchNextPage]);

  // Create like handler
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
        ?.map((challenge) => (
          <div key={challenge._id} className="mb-4">
            <ChallengeCard
              title={challenge?.challengeName}
              description={challenge?.description}
              id={challenge?._id}
              createdAt={challenge?.createdAt}
              challengeOwner={userData}
              className="max-w-sm w-full "
              viewsCount={cachedViewsMap[challenge?._id] || 0}
              likesCount={cachedLikesMap[challenge?._id]?.count || 0}
              isLiked={cachedLikesMap[challenge?._id]?.isLiked || false}
              onLike={() => handleLike(challenge?._id, "like")}
              onUnlike={() => handleLike(challenge?._id, "unlike")}
              commentCount={cachedCommentCountMap[challenge?._id] || 0}
              optimistic={challenge.optimistic}
              isDeleting={challenge.isDeleting}
              userId={userId}
            />
          </div>
        ))}
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
