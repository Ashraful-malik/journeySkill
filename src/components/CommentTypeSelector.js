// SearchComponent.js
"use client";
import { useParams, useSearchParams } from "next/navigation";
import PostComment from "@/components/comment/PostComment";
import ChallengeComment from "@/components/comment/ChallengeComment";

const CommentTypeSelector = () => {
  const commentId = useParams().id; // Get the comment ID from params
  const searchParams = useSearchParams(); // Use the search params
  const type = searchParams.get("type"); // Get the "type" query param

  return (
    <>
      {type === "post" ? (
        <PostComment id={commentId} key={commentId} />
      ) : (
        <ChallengeComment id={commentId} key={commentId} />
      )}
    </>
  );
};

export default CommentTypeSelector;
