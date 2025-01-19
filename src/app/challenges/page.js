"use client";

import ChallengeFeed from "@/components/feed/ChallengeFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import { useChallengeQuery } from "@/hooks/queries/useChallengeQuery";

import React, { useState } from "react";

function page() {
  const { data: challenges, isLoading, error } = useChallengeQuery();

  return (
    <WrapperLayout>
      {isLoading && <div>Loading...</div>}
      <ChallengeFeed challenges={challenges} />
    </WrapperLayout>
  );
}

export default page;
