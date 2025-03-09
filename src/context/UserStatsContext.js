"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import { useFetchUserPostsQuery } from "@/hooks/queries/usePostQuery";

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children, userId }) => {
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const { data: userChallenges } = useUserChallengesQuery(userId);
  //   fetch all user posts
  const { data: userPosts } = useFetchUserPostsQuery({ profileUserId: userId });
  useEffect(() => {
    if (userChallenges) {
      const total = userChallenges?.pages?.flatMap(
        (pageArray) => pageArray[0]?.pagination?.total || 0
      );
      setTotalChallenges(total);
    }
  }, [userChallenges]);

  useEffect(() => {
    if (userPosts) {
      const total = userPosts?.pages?.flatMap(
        (pageArray) => pageArray[0]?.pagination?.totalPosts || 0
      );
      setTotalPosts(total);
    }
  }, [userPosts]);

  return (
    <UserStatsContext.Provider value={{ totalChallenges, totalPosts }}>
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStats = () => useContext(UserStatsContext);
