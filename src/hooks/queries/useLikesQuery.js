import { fetchLikes } from "@/lib/api/like";
import { generateLikeQueryKey } from "@/lib/utils/consistentLikeQueryKey";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetLikesQuery = ({ postIds, userId, targetType }) => {
  return useQuery({
    queryKey: generateLikeQueryKey(postIds, userId),
    queryFn: () => fetchLikes(postIds, userId, targetType),
    enabled: postIds.length > 0 && !!userId,
    staleTime: 60 * 1000,
  });
};
