"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import React from "react";
import PostsTab from "@/components/createPostAndChallenge/PostsTab";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import { useGlobalUser } from "@/context/userContent";

function page() {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const { data: userChallenges } = useUserChallengesQuery(userId);
  return (
    <WrapperLayout>
      <PostsTab userChallenges={userChallenges} />
    </WrapperLayout>
  );
}

export default page;
