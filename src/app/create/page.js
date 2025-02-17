"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import React from "react";
import PostsTab from "@/components/createPostAndChallenge/PostsTab";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import { useGlobalUser } from "@/context/userContent";

function page() {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const { data: userChallenges, isLoading: isChallengeLoading } =
    useUserChallengesQuery(userId);
  return (
    <WrapperLayout>
      <PostsTab
        userChallenges={userChallenges}
        isChallengeLoading={isChallengeLoading}
      />
    </WrapperLayout>
  );
}

export default page;
