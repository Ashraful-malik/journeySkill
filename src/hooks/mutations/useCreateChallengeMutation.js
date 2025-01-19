import { createChallengeApi } from "@/lib/api/challenge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: ({ challengeData }) => createChallengeApi(challengeData),
    onMutate: async ({ challengeData }) => {
      console.log("challengeData", challengeData);
      await queryClient.cancelQueries(["challenges"]);
      const previousChallenges = queryClient.getQueryData(["challenges"]);
      queryClient.setQueryData(["challenges"], (oldData) => ({
        ...oldData,
        challengeData,
      }));
      return { previousChallenges };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
    onError: (error, variables, context) => {
      if (context?.previousChallenges) {
        queryClient.setQueryData(["challenges"], context.previousChallenges);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
  });
};
