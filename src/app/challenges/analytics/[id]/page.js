"use client";
import BackButton from "@/components/BackButton";
import ChallengeAnalytics from "@/components/challenge/analytics/ChallengeAnalytics";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ChallengeAnalyticsSkeleton from "@/components/skeleton/challenges/ChallengeAnalyticsSkeleton";
import { useUserChallengeAnalyticsQuery } from "@/hooks/queries/useChallengeQuery";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const { id: challengeId } = useParams();
  const { data: challengeAnalyticsData, isLoading } =
    useUserChallengeAnalyticsQuery(challengeId);

  return (
    <WrapperLayout>
      {isLoading ? (
        <ChallengeAnalyticsSkeleton />
      ) : (
        <>
          <BackButton />
          <ChallengeAnalytics challengeAnalyticsData={challengeAnalyticsData} />
        </>
      )}
    </WrapperLayout>
  );
}
export default Page;
