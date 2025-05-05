"use client";
import PostFeed from "@/components/feed/PostFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import HomeOnboardingTour from "@/components/onBoarding/HomeOnboardingTour";
import PostCardSkeleton from "@/components/skeleton/card/PostCardSkeleton";
import { useGlobalUser } from "@/context/userContent";
import { usePostQuery } from "@/hooks/queries/usePostQuery";
import { getOnboarding } from "@/lib/api/onboarding";
import { useEffect, useState } from "react";

const Page = () => {
  const {
    data: posts,
    isLoading: feedLoading,
    error: feedError,
    fetchNextPage,
    isFetchingNextPage,
  } = usePostQuery();

  //=========== new user onboarding=============
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const [runTour, setRunTour] = useState(null);

  // check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      const response = await getOnboarding(userId, "homePage");

      if (response?.data) {
        const onboardingRequired = !response.data.completed;
        setRunTour(onboardingRequired);
      } else {
        setRunTour(false);
      }
    };
    checkOnboarding();
  }, [userId]);

  return (
    <WrapperLayout>
      {runTour !== null && (
        <HomeOnboardingTour run={runTour} setRun={setRunTour} />
      )}
      {feedLoading ? (
        Array.from({ length: 4 }).map((_, idx) => (
          <div className="my-4" key={idx}>
            <PostCardSkeleton />
          </div>
        ))
      ) : (
        <PostFeed
          posts={posts}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </WrapperLayout>
  );
};

export default Page;
