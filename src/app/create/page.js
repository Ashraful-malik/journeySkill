"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import React, { useMemo } from "react";
import PostsTab from "@/components/createPostAndChallenge/PostsTab";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import { useGlobalUser } from "@/context/userContent";
import BackButton from "@/components/BackButton";

function Page() {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const { data: allUserChallenges, isLoading: isChallengeLoading } =
    useUserChallengesQuery(userId);

  const allChallenges = allUserChallenges?.pages?.flatMap(
    (page) => page?.allChallenges
  );

  return (
    <WrapperLayout>
      <BackButton />
      <PostsTab
        userChallenges={allChallenges}
        isChallengeLoading={isChallengeLoading}
      />
    </WrapperLayout>
  );
}

export default Page;
