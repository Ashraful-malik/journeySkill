import React from "react";
import ChallengeCard from "../cards/ChallengeCard";
import PostCard from "../cards/PostCard";

function ChallengeFeed() {
  const challengesCardContent = [
    {
      id: 1,
      title: "The React Challenge: Build a SaaS in 30 days",
      description:
        "I am taking the challenge to build a full-stack SaaS application using React in just 30 days. I will be posting my progress, experiences and lessons learned here.",
    },
    {
      id: 2,
      title: "The Nodejs Challenge: Build a scalable REST API in 30 days",
      description:
        "I am taking the challenge to build a scalable REST API using Nodejs in just 30 days. I will be posting my progress, experiences and lessons learned here.",
    },
    {
      id: 3,
      title:
        "The Typescript Challenge: Migrate a large codebase to Typescript in 30 days",
      description:
        "I am taking the challenge to migrate a large codebase to Typescript in just 30 days. I will be posting my progress, experiences and lessons learned here.",
    },
  ];
  return (
    <div className="flex-1 mx-auto py-4 ">
      <div className="flex flex-col gap-4">
        {challengesCardContent.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            description={challenge.description}
          />
        ))}
      </div>
    </div>
  );
}

export default ChallengeFeed;
