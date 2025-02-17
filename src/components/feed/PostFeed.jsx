"use client";

import { useCrateViewMutation } from "@/hooks/mutations/useViewMutation";
import PostCard from "../cards/PostCard";
import { useViewsQuery } from "@/hooks/queries/useViewQuery";
import { useEffect, useRef, useState } from "react";
import { useGlobalUser } from "@/context/userContent";
import { useGetLikesQuery } from "@/hooks/queries/useLikesQuery";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useCountCommentsQuery } from "@/hooks/queries/useCommentQuery";
import { LoaderCircle } from "lucide-react";

const VIEW_THRESHOLD_MS = 3000; // Minimum time to count a view (3 seconds)

const PostFeed = ({ posts, ref, hasNextPage }) => {
  const containerRef = useRef(null);
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  // get all vies by post

  const postIds = posts?.pages?.flatMap((page) =>
    page?.posts?.map((post) => post._id)
  );
  console.log("post Ids ===>", postIds);

  const { data: viewsMap = {}, isLoading: viewsLoading } = useViewsQuery({
    postIds: postIds,
    contentType: "Post",
  });

  // create views
  const { mutate: recordViews } = useCrateViewMutation();
  // State to track time spent on each post
  const [timeSpentMap, setTimeSpentMap] = useState(new Map());
  const [activeTimers, setActiveTimers] = useState(new Map()); // Track currently visible posts

  useEffect(() => {
    if (!containerRef.current) return; // Ensure posts are available
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute("data-post-id");

          if (entry.isIntersecting) {
            // Post enters viewport: start tracking time if not already tracking
            if (!activeTimers.has(postId)) {
              const startTime = Date.now();
              setActiveTimers(
                (prevTimers) => new Map(prevTimers.set(postId, startTime))
              );
            }
          } else {
            // Post exits viewport: update the time spent and reset timer
            if (activeTimers.has(postId)) {
              const startTime = activeTimers.get(postId);
              const elapsedTime = Date.now() - startTime;
              setTimeSpentMap((prevMap) => {
                const newMap = new Map(prevMap);
                const previousTime = newMap.get(postId) || 0;
                newMap.set(postId, previousTime + elapsedTime);
                return newMap;
              });

              setActiveTimers((prevTimers) => {
                const newTimers = new Map(prevTimers);
                newTimers.delete(postId);
                return newTimers;
              });
            }
          }
        });
      },
      { threshold: 0.7 } // 70% visibility threshold
    );
    const posts = containerRef.current.querySelectorAll("[data-post-id]");
    posts.forEach((post) => observer.observe(post));

    return () => {
      posts.forEach((post) => observer.unobserve(post));
      observer.disconnect();
    };
  }, [activeTimers, posts]);

  useEffect(() => {
    // Check every second if any post has crossed the time threshold
    const intervalId = setInterval(() => {
      const postsToRecord = [];
      timeSpentMap.forEach((timeSpent, postId) => {
        if (timeSpent >= VIEW_THRESHOLD_MS) {
          postsToRecord.push(postId);
          // Reset the time for this post after recording
          setTimeSpentMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(postId, 0);
            return newMap;
          });
        }
      });

      if (postsToRecord.length > 0) {
        // Record views for posts that meet the threshold
        recordViews({
          viewData: {
            postIds: postsToRecord,
            contentType: "Post",
            userId: userId,
          },
        });
      }
    }, 1000); // Check every 1 second for time spent

    return () => clearInterval(intervalId);
  }, [timeSpentMap, recordViews]);

  // batch fetch all likes
  const { data: likesMap = {}, isLoading: likesLoading } = useGetLikesQuery({
    paginatedPosts: posts,
    userId: userId,
    targetType: "Post",
  });

  // create Like
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = (postId, operation) => {
    addToBatch({
      targetId: postId,
      postIds: postIds, // Pass the postId as an array
      userId: userId,
      operation: operation, // "like" or "unlike"
      targetType: "Post",
    });
  };

  // get all comment count
  const { data: commentCountMap = {} } = useCountCommentsQuery({
    postIds: postIds,
    targetType: "post",
  });

  return (
    <div className="flex-1 max-w-2xl mx-auto" ref={containerRef} key={postIds}>
      {posts?.pages
        ?.flatMap((page) => page.posts)
        ?.map((post) => (
          <PostCard
            key={post._id}
            linkUrl={post?.link}
            content={post?.text}
            createdAt={post?.createdAt}
            image={post?.image}
            owner={post?.owner}
            challenge={post?.challengeId}
            postId={post?._id}
            viewCount={viewsMap[post._id] || 0}
            likesCount={likesMap[post._id]?.count || 0}
            isLiked={likesMap[post._id]?.isLiked || false}
            onLike={() => handleLike(post._id, "like")} // Pass like handler
            onUnlike={() => handleLike(post._id, "unlike")} // Pass unlike handler
            commentCount={commentCountMap[post._id] || 0}
            optimistic={post.optimistic}
            viewsLoading={viewsLoading}
            likeLoading={likesLoading}
            isDeleting={post.isDeleting}
          />
        ))}
      {hasNextPage && (
        <div ref={ref}>
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
              Loading more...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
