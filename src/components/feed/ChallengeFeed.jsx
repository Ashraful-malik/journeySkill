import React from "react";
import ChallengeCard from "../cards/ChallengeCard";
import { useViewsQuery } from "@/hooks/queries/useViewQuery";
import { useGetLikesQuery } from "@/hooks/queries/useLikesQuery";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { useGlobalUser } from "@/context/userContent";
import { useCountCommentsQuery } from "@/hooks/queries/useCommentQuery";

function ChallengeFeed({ challenges }) {
  const postIds = challenges?.allChallenges?.map((challenge) => challenge?._id);
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;

  // bath fetch  all views
  const { data: viewsMap = {} } = useViewsQuery({
    postIds: postIds,
    contentType: "Challenge",
  });

  // batch fetch all likes
  const { data: likesMap = {} } = useGetLikesQuery({
    postIds: postIds,
    userId: userId,
    targetType: "Challenge",
  });
  console.log("like of challenge", likesMap);
  // get all comment count
  const { data: commentCountMap = {} } = useCountCommentsQuery({
    postIds: postIds,
    targetType: "challenge",
  });
  // create like
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = (postId, operation) => {
    addToBatch({
      targetId: postId,
      postIds: postIds, // Pass the postId as an array
      userId: userId,
      operation: operation, // "like" or "unlike"
      targetType: "Challenge",
    });
  };

  return (
    <div className="flex-1 mx-auto py-4 ">
      <div className="flex flex-col gap-4">
        {challenges?.allChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge?._id}
            id={challenge?._id}
            title={challenge?.challengeName}
            description={challenge?.description}
            tags={challenge?.challengeTags}
            challengeDays={challenge?.challengeDays}
            challengeOwner={challenge?.owner}
            createdAt={challenge?.createdAt}
            viewsCount={viewsMap[challenge?._id] || 0}
            likesCount={likesMap[challenge?._id]?.count || 0}
            isLiked={likesMap[challenge?._id]?.isLiked || false}
            onLike={() => handleLike(challenge?._id, "like")} // Pass like handler
            onUnlike={() => handleLike(challenge?._id, "unlike")} // Pass unlike handler
            commentCount={commentCountMap[challenge?._id] || 0}
          />
        ))}
      </div>
    </div>
  );
}

export default ChallengeFeed;
