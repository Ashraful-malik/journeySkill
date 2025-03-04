"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChallengeByIdQuery } from "@/hooks/queries/useChallengeQuery";
import IndividualChallenge from "@/components/challenge/IndividualChallenge";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import IndividualChallengeSkeleton from "@/components/skeleton/challenges/IndividualChallengeSkeleton";

export default function ChallengePage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params?.id;
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Challenge data query
  const {
    data: challenge,
    isLoading,
    isError,
    error,
  } = useChallengeByIdQuery(challengeId);

  useEffect(() => {
    // Don't proceed if challengeId is missing or invalid
    if (!challengeId || !challengeId.match(/^[a-f\d]{24}$/i)) {
      setShouldRedirect(true);
      return;
    }

    // Don't proceed if the query is still loading
    if (isLoading) {
      return;
    }

    // Redirect if the query fails with a 404 error
    if (isError && error?.status === 404) {
      setShouldRedirect(true);
      return;
    }

    // Redirect if the query completes but no data is found
  }, [challengeId, isLoading, isError, error]);

  // Perform the redirect if needed
  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/404");
    }
  }, [shouldRedirect, router]);

  // Show loading state while validating
  if (isLoading || !challenge) {
    return (
      <WrapperLayout>
        <IndividualChallengeSkeleton />
      </WrapperLayout>
    );
  }

  // Render the challenge if all checks pass
  return (
    <WrapperLayout>
      <IndividualChallenge challengeId={challengeId} />
    </WrapperLayout>
  );
}
