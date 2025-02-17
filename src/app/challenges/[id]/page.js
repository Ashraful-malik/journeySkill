"use client";

import { useParams, useRouter } from "next/navigation";
import { useChallengeByIdQuery } from "@/hooks/queries/useChallengeQuery";
import IndividualChallenge from "@/components/challenge/IndividualChallenge";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import { useEffect } from "react";
import IndividualChallengeSkeleton from "@/components/skeleton/challenges/IndividualChallengeSkeleton";

function Page() {
  const router = useRouter();
  const { id: challengeId } = useParams(); // ✅ Extract challengeId from params

  // 🔹 Fetch challenge data using React Query
  const {
    data: challenge,
    isLoading: challengeLoading,
    error,
  } = useChallengeByIdQuery(challengeId);

  // 🔹 Redirect to 404 if challenge is missing or error occurs
  useEffect(() => {
    if (
      !challengeId ||
      challengeId === "undefined" ||
      (!challengeLoading && !challenge)
    ) {
      router.replace("/404"); // ✅ Redirect if invalid
    }
  }, [challengeId, challenge, challengeLoading, router]);

  // 🔹 Prevent rendering if challenge doesn't exist
  // if (!challenge) return null;

  return (
    <WrapperLayout>
      {challengeLoading || !challenge ? (
        <IndividualChallengeSkeleton />
      ) : (
        <IndividualChallenge challengeId={challengeId} />
      )}
    </WrapperLayout>
  );
}

export default Page;
