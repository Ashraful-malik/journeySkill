import {
  fetchChallengePosts,
  fetchEngagementMetrics,
  fetchPostById,
  fetchPosts,
  fetchUserPosts,
} from "@/lib/api/post";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import md5 from "md5";
import { useMemo } from "react";

// fetch all posts
export const usePostQuery = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ pageParams: pageParam }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined; // 🛠 Handle missing data safely
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch all user posts
export const useFetchUserPostsQuery = ({ profileUserId }) => {
  return useInfiniteQuery({
    queryKey: ["post", profileUserId],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserPosts({ profileUserId, pageParams: pageParam }),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!profileUserId,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch all post of challenge
export const useChallengePostsQuery = (challengeId) => {
  return useInfiniteQuery({
    queryKey: ["challenge-posts", challengeId],
    queryFn: ({ pageParam = 1 }) =>
      fetchChallengePosts({ challengeId, pageParam }),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!challengeId,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch post by id
export const usePostByIdQuery = (postId) => {
  return useQuery({
    queryKey: ["post-by-id", postId],
    queryFn: () => fetchPostById(postId),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Use React Query's useQueries for parallel requests

// fetch inganment matrix
export const useEngagementMetrics = ({
  postIds,
  userId,
  targetType,
  contentType,
}) => {
  // Generate a stable query key
  const queryKey = useMemo(
    () => [
      "engagementMetrics",
      md5(postIds.join(",")),
      userId,
      targetType,
      contentType,
    ],
    [userId, targetType, contentType, postIds]
  );

  return useQuery({
    queryKey,
    queryFn: () =>
      fetchEngagementMetrics({ postIds, userId, targetType, contentType }),
    enabled: postIds.length > 0 && !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};
