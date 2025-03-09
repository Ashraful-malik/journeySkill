"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import PostsTab from "@/components/createPostAndChallenge/PostsTab";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import { useGlobalUser } from "@/context/userContent";
import BackButton from "@/components/BackButton";
import { Suspense } from "react";

function Page() {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const {
    data: allUserChallenges,
    isLoading: isChallengeLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUserChallengesQuery(userId);

  const allChallenges = allUserChallenges?.pages?.flatMap((pageArray) =>
    Array.isArray(pageArray)
      ? pageArray.flatMap((page) =>
          Array.isArray(page.allChallenges)
            ? page.allChallenges.map((challenge) => challenge)
            : []
        )
      : []
  );

  return (
    <WrapperLayout>
      <BackButton />
      {/* Wrap PostsTab with Suspense to handle client-side hooks */}
      <Suspense fallback={<div>Loading...</div>}>
        <PostsTab
          userChallenges={allChallenges}
          isChallengeLoading={isChallengeLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </Suspense>
    </WrapperLayout>
  );
}

export default Page;
