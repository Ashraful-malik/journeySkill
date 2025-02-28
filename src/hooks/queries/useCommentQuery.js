import { fetchComments, fetchCountComments } from "@/lib/api/comment";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCommentByIdQuery = ({ id, contentType }) => {
  return useInfiniteQuery({
    queryKey: ["comment", id],
    queryFn: ({ pageParam = 1 }) =>
      fetchComments({ id, contentType, pageParams: pageParam }),
    enabled: !!id,
    staleTime: 60 * 1000,
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
  const stablePostIds = useMemo(() => postIds || [], [postIds]);
  return useQuery({
    queryKey: ["countComments", stablePostIds, targetType],
    queryFn: () => fetchCountComments(stablePostIds, targetType),
    enabled: stablePostIds.length > 0 && !!targetType,
    staleTime: 60 * 1000,
  });
};
