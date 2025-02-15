import { fetchLikes } from "@/lib/api/like";
import { generateLikeQueryKey } from "@/lib/utils/consistentLikeQueryKey";
import { useQuery } from "@tanstack/react-query";

export const useGetLikesQuery = ({ postIds, userId, targetType }) => {
  // Sort and deduplicate postIds to ensure stable JSON keys

  return useQuery({
    queryKey: generateLikeQueryKey(postIds, userId),
    queryFn: () => fetchLikes(postIds, userId, targetType),
    enabled: !!postIds && !!userId,
    staleTime: 60 * 1000, // 1 minute stale time
  });
};
