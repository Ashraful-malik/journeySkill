"use client";
import ChallengeComment from "@/components/comment/ChallengeComment";
import PostComment from "@/components/comment/PostComment";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

function page() {
  const commentId = useParams().id;
  const posteType = useSearchParams();
  const type = posteType.get("type");

  return (
    <WrapperLayout>
      {type === "post" ? (
        <PostComment id={commentId} key={commentId} />
      ) : (
        <ChallengeComment id={commentId} key={commentId} />
      )}
    </WrapperLayout>
  );
}

export default page;
