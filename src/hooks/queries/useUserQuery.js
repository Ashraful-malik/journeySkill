import { fetchUser } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
export const useUserQuery = () => {
  const { user } = useUser();
  const userId = user?.publicMetadata?.userId;

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false, // Prevent redundant refetching
  });
};
