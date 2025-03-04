"use client";
import React, { useMemo, useCallback, useRef, useEffect } from "react";
import PostCard from "@/components/cards/PostCard";
import {
  useEngagementMetrics,
  useFetchUserPostsQuery,
} from "@/hooks/queries/usePostQuery";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useGlobalUser } from "@/context/userContent";
import Masonry from "react-masonry-css";
import PostCardSkeleton from "@/components/skeleton/card/PostCardSkeleton";
import { LoaderCircle } from "lucide-react";

function UserPosts({ userData }) {
  const profileUserId = userData?._id;
  const { user } = useGlobalUser();
  const LoginUserId = user?.publicMetadata?.userId;

  const {
    data: userPosts,
    isLoading: postLoading,
    fetchNextPage,
    hasNextPage,
  } = useFetchUserPostsQuery({ profileUserId });

  const postIds = useMemo(() => {
    return (
      userPosts?.pages?.flatMap((page) =>
        page.posts?.map((post) => post._id)
      ) || []
    );
  }, [userPosts]);

  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId: LoginUserId,
      targetType: "Post",
      contentType: "Post",
    });

  //   -----------------observer for infinite scrolling-------------------
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage || postLoading) return;
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
  }, [hasNextPage, postLoading, fetchNextPage]);

  // break point column object
  const breakPointColumnsObj = {
    default: 2, // 3 columns by default
    1024: 2, // 2 columns on tablets
    768: 1, // 1 column on mobile
  };
  // --------------Create like -------------
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = useCallback(
    (postId, operation) => {
      addToBatch({
        targetId: postId,
        postIds: postIds,
        userId: LoginUserId,
        operation: operation,
        targetType: "Post",
      });
    },
    [postIds, LoginUserId, addToBatch]
  );

  if (postLoading) {
    return (
      <div className="flex gap-2 md:flex-nowrap flex-wrap">
        {Array.from({ length: 2 }, (_, i) => (
          <PostCardSkeleton key={i} />
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
      {userPosts?.pages
        ?.flatMap((page) => page.posts)
        ?.map((post) => {
          const engagement = engagementData?.[post._id] || {};
          return (
            <PostCard
              key={post._id}
              linkUrl={post?.link}
              content={post?.text}
              createdAt={post?.createdAt}
              image={post?.image}
              owner={post?.owner}
              challenge={post?.challengeId}
              postId={post?._id}
              onLike={() => handleLike(post._id, "like")}
              onUnlike={() => handleLike(post._id, "unlike")}
              viewCount={engagement.views}
              commentCount={engagement.comments}
              likesCount={engagement.likes?.count || 0}
              isLiked={engagement.likes?.isLiked || false}
              likeLoading={engagementLoading}
              isDeleting={post.isDeleting}
              userId={LoginUserId}
            />
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

export default UserPosts;
