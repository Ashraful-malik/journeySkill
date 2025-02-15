import {
  fetchChallengePosts,
  fetchPostById,
  fetchPosts,
  fetchUserPosts,
} from "@/lib/api/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// fetch all posts
export const usePostQuery = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ pageParams: pageParam }),
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined; // 🛠 Handle missing data safely
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch all user posts
export const useFetchUserPostsQuery = (userId) => {
  return useQuery({
    queryKey: ["post", userId],
    queryFn: () => fetchUserPosts(userId),
  });
};

// fetch all post of challenge
export const useChallengePostsQuery = (challengeId) => {
  return useQuery({
    queryKey: ["challenge-posts", challengeId],
    queryFn: () => fetchChallengePosts(challengeId),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!challengeId,
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
