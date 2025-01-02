import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Comment from "./view/Comment";
import ChallengeCard from "../cards/ChallengeCard";

function ChallengeComment({ id }) {
  return (
    <div className="w-full border-r border-l mt-2">
      <ChallengeCard
        tags={["#coding", "#art", "#react"]}
        title={"The React Challenge: Build a SaaS in 30 days"}
        description={
          "I am taking the challenge to build a full-stack SaaS application using React in just 30 days. I will be posting my progress, experiences and lessons learned here."
        }
        link={2}
      />
      <section className="flex flex-col gap-2 ">
        {/* comment input */}
        <div className="flex items-center ">
          <Input
            placeholder="Add a comment"
            className=" rounded-none h-12 border-r-0"
          />
          <Button size="lg" variant="outline" className="h-12 rounded-none">
            Comment
          </Button>
        </div>
        {/* comments */}
        <div className="ml-2">
          <Comment
            profileImage="https://avatars.githubusercontent.com/u/43632556?v=4"
            name="Steve"
            comment="first comment"
          />
          <Comment
            profileImage="https://avatars.githubusercontent.com/u/43632556?v=4"
            name="Steve"
            comment="Nice picture where did you click this from "
          />
        </div>
      </section>
    </div>
  );
}

export default ChallengeComment;
