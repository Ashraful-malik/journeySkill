import { fetchUser } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
export const useUserQuery = () => {
  const { user } = useUser();
  const userId = user?.publicMetadata?.userId;

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    staleTime: 10000, // 10 seconds
    refetchOnMount: false, // Prevent redundant refetching
    // enabled: !!userId,
  });
};
