"use client";

import ChallengeFeed from "@/components/feed/ChallengeFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";

import React, { useState } from "react";

function page() {
  return (
    <WrapperLayout>
      <ChallengeFeed />
    </WrapperLayout>
  );
}

export default page;
