import IndividualChallenge from "@/components/challenge/IndividualChallenge";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import React from "react";

function index({ params }) {
  const slug = params.slug;

  return (
    <WrapperLayout>
      <IndividualChallenge />
    </WrapperLayout>
  );
}

export default index;
