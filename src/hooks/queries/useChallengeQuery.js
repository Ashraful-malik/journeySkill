import {
  fetchChallenges,
  fetchUserChallenges,
  fetchUserChallengesAnalytics,
  getChallengeById,
} from "@/lib/api/challenge";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// fetching all challenges
export const useChallengeQuery = () => {
  return useInfiniteQuery({
    queryKey: ["challenges"],
    queryFn: ({ pageParam = 1 }) => fetchChallenges({ pageParams: pageParam }),
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        !lastPage ||
        !lastPage.pagination ||
        Array.isArray(lastPage) ||
        lastPage.length === 0
      )
        return undefined;
      const pageData = lastPage[0];
      if (!pageData.pagination) return undefined;
      const { currentPage, totalPages } = pageData.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch challenge by id
export const useChallengeByIdQuery = (challengeId) => {
  return useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: () => getChallengeById(challengeId),
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });
};

// fetch all user challenges
export const useUserChallengesQuery = (userId) => {
  return useInfiniteQuery({
    queryKey: ["user-challenges", userId],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserChallenges({ userId, pageParams: pageParam }),
    initialPageParam: 1,
    enabled: !!userId,
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    getNextPageParam: (lastPage) => {
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length === 0)
        return undefined;
      const pageData = lastPage[0];
      if (!pageData?.pagination) return undefined;
      const { currentPage, totalPages } = pageData.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

// fetch user challenge analytics
export const useUserChallengeAnalyticsQuery = (challengeId) => {
  return useQuery({
    queryKey: ["user-challenge-analytics", challengeId],
    queryFn: () => fetchUserChallengesAnalytics(challengeId),
    enabled: !!challengeId,
    staleTime: 60 * 1000, // Data is fresh for 1 minute
  });
};
