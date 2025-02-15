"use client";
import IndividualChallenge from "@/components/challenge/IndividualChallenge";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const [challengeId, setChallengeId] = useState(null);

  useEffect(() => {
    const getId = async () => {
      const { id } = await params;
      setChallengeId(id);
    };
    getId();
  }, [params]);
  return (
    <WrapperLayout>
      <IndividualChallenge challengeId={challengeId} key={challengeId} />
    </WrapperLayout>
  );
}

export default page;
