import {
  fetchChallenges,
  fetchUserChallenges,
  getChallengeById,
} from "@/lib/api/challenge";
import { useQuery } from "@tanstack/react-query";

// fetching all challenges
export const useChallengeQuery = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: () => fetchChallenges(),
  });
};

// fetch challenge by id
export const useChallengeByIdQuery = (challengeId) => {
  return useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: () => getChallengeById(challengeId),
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
