import { fetchViews } from "@/lib/api/view";
import { useQuery } from "@tanstack/react-query";
import md5 from "md5";

export const useViewsQuery = ({ postIds, contentType }) => {
  // Sort and create a hash for a stable query key
  const sortedIds = (postIds || []).sort(); // Default to an empty array if undefined
  const queryKey = ["views", md5(sortedIds.join(","))];
  return useQuery({
    queryKey,
    queryFn: () => fetchViews({ postIds, contentType }),
    enabled: Array.isArray(postIds) && postIds.length > 0, // Only fetch if postIds is a valid array with items
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });
};
