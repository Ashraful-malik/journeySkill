import BackButton from "@/components/BackButton";
import ChallengeAnalytics from "@/components/challenge/analytics/ChallengeAnalytics";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import React from "react";

export default async function Page({ params }) {
  const { id } = await params;
  return (
    <WrapperLayout>
      <BackButton />
      <ChallengeAnalytics />
    </WrapperLayout>
  );
}
