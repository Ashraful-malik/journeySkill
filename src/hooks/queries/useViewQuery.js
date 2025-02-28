import { fetchViews } from "@/lib/api/view";
import { useQuery } from "@tanstack/react-query";
import md5 from "md5";
import { useMemo } from "react";

export const useViewsQuery = ({ postIds, contentType }) => {
  // Sort and create a hash for a stable query key
  const stablePostIds = useMemo(() => (postIds || []).sort(), [postIds]); // Ensure stability  const queryKey = ["views", md5(sortedIds.join(","))];
  const queryKey = useMemo(
    () => ["views", md5(stablePostIds.join(","))],
    [stablePostIds]
  );

  return useQuery({
    queryKey,
    queryFn: () => fetchViews({ postIds, contentType }),
    enabled: stablePostIds.length > 0,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });
};
