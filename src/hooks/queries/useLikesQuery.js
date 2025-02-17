import { fetchLikes } from "@/lib/api/like";
import { generateLikeQueryKey } from "@/lib/utils/consistentLikeQueryKey";
import { useQuery } from "@tanstack/react-query";

export const useGetLikesQuery = ({ paginatedPosts, userId, targetType }) => {
  let postIds;
  if (targetType === "Post") {
    postIds = paginatedPosts?.pages
      ?.flatMap((page) => page?.posts?.map((post) => post._id))
      ?.filter(Boolean); // Remove undefined/null values
  } else {
    postIds = paginatedPosts?.pages
      ?.flatMap((page) =>
        page?.allChallenges?.map((challenge) => challenge._id)
      )
      ?.filter(Boolean); // Remove undefined/null values
  }
  return useQuery({
    queryKey: generateLikeQueryKey(postIds, userId),
    queryFn: () => fetchLikes(postIds, userId, targetType),
    enabled: postIds?.length > 0 && !!userId,
    staleTime: 60 * 1000,
  });
};
