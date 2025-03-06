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
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    if (!Array.isArray(userPosts?.pages)) return [];
    return userPosts.pages.flatMap((pageArray) =>
      Array.isArray(pageArray)
        ? pageArray.flatMap((page) =>
            Array.isArray(page.posts)
              ? page.posts.map((challenge) => challenge._id).filter(Boolean)
              : []
          )
        : []
    );
  }, [userPosts]);

  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId: LoginUserId,
      targetType: "Post",
      contentType: "Post",
    });
  // -------all user posts--------------
  const allUserPosts = Array.isArray(userPosts?.pages)
    ? userPosts.pages.flatMap((pageArray) =>
        Array.isArray(pageArray)
          ? pageArray.flatMap((page) => page?.posts || [])
          : []
      )
    : [];
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
  console.log(hasNextPage);
  return (
    <>
      {allUserPosts?.length === 0 && (
        <div
          className="text-center text-muted-foreground  w-full 
         "
        >
          <div className="flex items-center justify-center flex-col gap-2 max-w-lg mx-auto p-4">
            <p>
              No posts? No problem! Every great journey starts with the first
              step. Time to create your first post!
            </p>
            <Link
              href="/create"
              className="px-4 bg-primary/95 py-2 rounded-sm text-sm font-semibold 
              text-primary-foreground hover:bg-primary/90"
            >
              Create a Post
            </Link>
          </div>
        </div>
      )}
      <Masonry
        breakpointCols={breakPointColumnsObj}
        className="flex gap-2"
        columnClassName="masonry-column"
      >
        {allUserPosts?.map((post) => {
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
    </>
  );
}

export default UserPosts;
