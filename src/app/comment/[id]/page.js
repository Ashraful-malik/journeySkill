"use client";
import ChallengeComment from "@/components/comment/ChallengeComment";
import PostComment from "@/components/comment/PostComment";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const [commentId, setCommentId] = useState(null);

  const posteType = useSearchParams();
  const type = posteType.get("type");

  useEffect(() => {
    const getId = async () => {
      const { id } = await params;
      setCommentId(id);
    };
    getId();
  }, [params]);
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
