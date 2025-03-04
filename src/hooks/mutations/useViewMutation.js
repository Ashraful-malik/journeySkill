import { createView } from "@/lib/api/view";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCrateViewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["view"],
    mutationFn: ({ viewData }) => createView(viewData),

    onMutate: async () => {
      await queryClient.cancelQueries(["views"]);
      const previousViews = queryClient.getQueryData(["views"]);
      return { previousViews };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["views"]);
    },
    onError: (error, variables, context) => {
      if (context?.previousViews) {
        queryClient.setQueryData(["views"], context.previousViews);
      }
    },
  });
};
