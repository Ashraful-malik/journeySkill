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
    queryFn: () => fetchChallenges(),
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { currentPage, totalPages } = lastPage.pagination;
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
    staleTime: Infinity, // Data is fresh for Infinity seconds
  });
};

// fetch all user challenges
export const useUserChallengesQuery = (userId) => {
  return useQuery({
    queryKey: ["user-challenges", userId],
    queryFn: () => fetchUserChallenges(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
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
