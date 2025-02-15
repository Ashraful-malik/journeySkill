"use client";
import BackButton from "@/components/BackButton";
import ChallengeAnalytics from "@/components/challenge/analytics/ChallengeAnalytics";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import ChallengeAnalyticsSkeleton from "@/components/skeleton/challenges/ChallengeAnalyticsSkeleton";
import { useUserChallengeAnalyticsQuery } from "@/hooks/queries/useChallengeQuery";
import React, { useEffect, useState } from "react";

function Page({ params }) {
  const [challengeId, setChallengeId] = useState(null);
  const { data: challengeAnalyticsData, isLoading } =
    useUserChallengeAnalyticsQuery(challengeId);

  useEffect(() => {
    const getId = async () => {
      const { id } = await params;
      setChallengeId(id);
    };
    getId();
  });

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
