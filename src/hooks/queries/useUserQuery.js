import { fetchUser, fetchUserProfile } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
export const useUserQuery = () => {
  const { user } = useUser();
  const userId = user?.publicMetadata?.userId;
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    staleTime: 60 * 60 * 1000, //1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// get user profile data
export const useUserProfileQuery = (username) => {
  return useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => fetchUserProfile(username),
    staleTime: 60 * 60 * 1000, //1 hour
    enabled: !!username,
  });
};
