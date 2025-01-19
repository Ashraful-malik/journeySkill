import { fetchPosts, fetchUserPosts } from "@/lib/api/post";
import { useQuery } from "@tanstack/react-query";

// fetch all posts
export const usePostQuery = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchPosts(),
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
  });
};

// fetch post by user
export const useFetchUserPostsQuery = (userId) => {
  return useQuery({
    queryKey: ["post", userId],
    queryFn: () => fetchUserPosts(userId),
  });
};
