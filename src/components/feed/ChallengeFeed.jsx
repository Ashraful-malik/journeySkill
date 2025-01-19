import React from "react";
import ChallengeCard from "../cards/ChallengeCard";
import PostCard from "../cards/PostCard";

function ChallengeFeed({ challenges }) {
  console.log("challenges", challenges);
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
          />
        ))}
      </div>
    </div>
  );
}

export default ChallengeFeed;
