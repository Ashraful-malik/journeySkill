import { fetchComments, fetchCountComments } from "@/lib/api/comment";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useCommentByIdQuery = ({ id, contentType }) => {
  return useInfiniteQuery({
    queryKey: ["comment", id],
    queryFn: ({ pageParam = 1 }) =>
      fetchComments({ id, contentType, pageParams: pageParam }),
    enabled: !!id,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Check if there are more pages based on backend metadata
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch only total comments count
export const useCountCommentsQuery = ({ postIds, targetType }) => {
  return useQuery({
    queryKey: ["countComments", postIds, targetType],
    queryFn: () => fetchCountComments(postIds, targetType),
    enabled: !!postIds && !!targetType,
    staleTime: 60 * 1000, // 1 minute stale time
  });
};
