"use client";
import { useCrateViewMutation } from "@/hooks/mutations/useViewMutation";
import PostCard from "../cards/PostCard";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { useGlobalUser } from "@/context/userContent";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { Virtuoso } from "react-virtuoso";
import { useEngagementMetrics } from "@/hooks/queries/usePostQuery";
import PostCardSkeleton from "../skeleton/card/PostCardSkeleton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DEBOUNCE_DELAY = 5000; // Debounce delay for view tracking

const PostFeed = ({ posts, isFetchingNextPage, fetchNextPage }) => {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const router = useRouter();

  const postIds = useMemo(() => {
    if (!Array.isArray(posts?.pages)) return [];
    return posts.pages.flatMap((pageArray) =>
      Array.isArray(pageArray)
        ? pageArray.flatMap((page) =>
            Array.isArray(page.posts)
              ? page.posts.map((post) => post._id).filter(Boolean)
              : []
          )
        : []
    );
  }, [posts]);

  // --------------Loading likes vies and comments-------------------------
  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId,
      targetType: "Post",
      contentType: "Post",
    });

  // -------------------Record views logic-----------------------
  const { mutate: recordViews } = useCrateViewMutation();

  const viewQueue = useRef(new Map());
  const flushTimeout = useRef(null);
  const recordPosts = useRef(new Set());

  // handle view recording
  const handleView = useCallback(
    (postId) => {
      if (!recordPosts.current.has(postId)) {
        recordPosts.current.add(postId);
        viewQueue.current.set(postId, Date.now());

        // Debounce api call
        if (!flushTimeout.current) {
          flushTimeout.current = setTimeout(() => {
            const payload = Array.from(viewQueue.current.keys());

            // send to the server
            recordViews(
              {
                viewData: {
                  postIds: payload,
                  contentType: "Post",
                  userId,
                },
              },
              {
                onSuccess: () => {
                  viewQueue.current.clear();
                  flushTimeout.current = null;
                },
                onError: (error) => {
                  viewQueue.current.clear();
                  flushTimeout.current = null;
                },
              }
            );
          }, DEBOUNCE_DELAY);
        }
      }
    },
    [recordViews, userId]
  );

  // reset record post after 30 second
  useEffect(() => {
    const resetTimer = setInterval(() => {
      recordPosts.current.clear();
    }, 30000); // Reset every 30 seconds

    return () => clearInterval(resetTimer);
  }, []);

  // Force flush view queue when the component unmounts
  useEffect(() => {
    const currentViewQueue = new Map(viewQueue.current);
    return () => {
      if (currentViewQueue.size > 0) {
        const payload = Array.from(currentViewQueue.entries()).map(
          ([postId, timestamp]) => ({
            postId,
            timestamp,
          })
        );
        // send to the server
        recordViews({
          viewData: {
            postIds: payload,
            contentType: "Post",
            userId,
          },
        });
      }
    };
  }, [recordViews, userId]);

  // -----------------------like Creation Logic ----------------------------------------
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = useCallback(
    (postId, operation) => {
      addToBatch({
        targetId: postId,
        postIds: postIds,
        userId: userId,
        operation: operation,
        targetType: "Post",
      });
    },
    [postIds, userId, addToBatch]
  );

  // Memoized PostCard to prevent unnecessary re-renders
  const MemoizedPostCard = useCallback(
    (post) => {
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
          optimistic={post?.optimistic}
          onView={handleView}
          viewCount={engagement.views}
          commentCount={engagement.comments}
          likesCount={engagement.likes?.count || 0}
          isLiked={engagement.likes?.isLiked || false}
          likeLoading={engagementLoading}
          isDeleting={post.isDeleting}
          userId={userId}
        />
      );
    },
    [engagementData, engagementLoading, handleLike, handleView, userId]
  );
  // Check if there are no challenges
  const allPosts = useMemo(() => {
    return Array.isArray(posts?.pages)
      ? posts.pages.flatMap((pageArray) =>
          Array.isArray(pageArray)
            ? pageArray.flatMap((page) => page?.posts || [])
            : []
        )
      : [];
  }, [posts]);

  return (
    <div className="flex-1 max-w-2xl mx-auto">
      {/* {allPosts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <h2 className="text-xl font-semibold mb-4">
            🌱 No Posts Yet... Be the First to Share!
          </h2>
          <p className=" max-w-lg mb-6">
            The feed is empty—create a challenge and share your journey. Whether
            you&apos;re starting or progressing, your posts can inspire others
            to join in.💪
          </p>
          <Button onClick={() => router.push("/create")} variant="default">
            Create Your Challenge
          </Button>
        </div>
      ) : ( */}
      <Virtuoso
        useWindowScroll
        data={[
          ...posts.pages?.flatMap((pageArray) =>
            pageArray.flatMap((page) => page.posts)
          ),
          ...(isFetchingNextPage
            ? new Array(3).fill({ isSkeleton: true })
            : []),
        ]}
        endReached={fetchNextPage}
        overscan={500}
        itemContent={(_, post) =>
          post.isSkeleton ? <PostCardSkeleton /> : MemoizedPostCard(post)
        }
      />
      {/* )} */}
    </div>
  );
};

export default PostFeed;
