import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChartColumnStacked, Info, User } from "lucide-react";
import { Button } from "../ui/button";
import PostCard from "../cards/PostCard";
import { Progress } from "../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { useChallengeByIdQuery } from "@/hooks/queries/useChallengeQuery";
import BackButton from "../BackButton";

const calculateProgress = ({ tasksRequired, tasksCompleted }) => {
  // Avoid division by zero
  if (!tasksRequired || tasksRequired === 0) {
    return 0;
  }
  const progress = (tasksCompleted / tasksRequired) * 100;
  return Math.min(progress, 100).toFixed(2);
};

const calculateElapsedDays = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const elapsed = Math.max(0, (now - start) / (1000 * 60 * 60 * 24)); // Days elapsed
  const total = Math.max(1, (end - start) / (1000 * 60 * 60 * 24)); // Total days
  return { elapsedDays: Math.min(elapsed, total), totalDays: total };
};

function IndividualChallenge({ challengeId }) {
  const { data: challenge, isLoading } = useChallengeByIdQuery(challengeId);
  const challengeOwner = challenge?.challengeOwner;
  const challengeStartingDate = new Date(
    challenge?.startDate
  ).toLocaleDateString();

  const progress = calculateProgress({
    tasksRequired: challenge?.tasksRequired,
    tasksCompleted: challenge?.tasksCompleted,
  });

  const { elapsedDays, totalDays } = calculateElapsedDays(
    challenge?.startDate,
    challenge?.endDate
  );

  const posts = [
    {
      content:
        "I am doing a 30 days challenge to improve my coding skills. Each day, I am dedicating time to learn new concepts and apply them in small projects. It's been a rewarding experience so far and I'm excited to see my progress by the end of the challenge.",
      image:
        "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww",
      link: "https://journeyskill.verce.app",
    },
    {
      content:
        "I am doing a 30 days challenge to improve my coding skills. Each day, I am dedicating time to learn new concepts and apply them in small projects. It's been a rewarding experience so far and I'm excited to see my progress by the end of the challenge.",
      image:
        "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww",
      link: "https://journeyskill.verce.app",
    },
  ];

  return (
    <>
      <div className="px-2 lg:px-0">
        <BackButton />
        {isLoading && <div>Loading...</div>}
        {/* Header */}
        <header className="flex items-center justify-between pb-4 mt-5">
          <div className="flex items-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={challengeOwner?.profileImage?.imageUrl}
                alt={challenge?.username}
              />
              <AvatarFallback aria-label="User's initials">
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-base font-semibold hover:underline">
                <Link href={`/profile/${challengeOwner?.username}`}>
                  {challenge?.challengeOwner?.fullName}
                </Link>
              </h1>
              <p className="text-sm text-muted-foreground">
                {challenge?.challengeOwner?.username}
              </p>
            </div>
          </div>
          {/* Follow Button */}
          <Button size="sm">Follow</Button>
        </header>

        {/* Progress Bar Section */}
        <div aria-labelledby="progress-label" className="my-4">
          <div className="flex items-center justify-between mb-2">
            <p id="progress-label" className="text-sm text-muted-foreground">
              Progress: {progress}% ({challenge?.tasksCompleted} out of{" "}
              {challenge?.tasksRequired} tasks completed).
            </p>
            {/* Tooltip for Progress */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-sm underline cursor-pointer">
                    <Info size={20} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-sm">
                    Progress represents the percentage of tasks you've completed
                    out of the total required for this challenge.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress
            value={progress}
            className={`progress-bar ${
              progress < 50
                ? "bg-red-500"
                : progress < 75
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${progress}% completed`}
          />
          {progress === 0 && (
            <p className="text-sm italic text-muted-foreground">
              You haven’t started yet! Let’s get going and complete your first
              task.
            </p>
          )}
        </div>

        {/* Body */}
        <div className="my-8">
          <div className="content">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Challenge started: {challengeStartingDate}
              </p>
              {/* Analytics */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={`/challenges/analytics/${challengeId}`}>
                      <ChartColumnStacked size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Challenge Analytics</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
              {challenge?.challengeName}
            </h1>
            <p className="text-base leading-7 max-w-[70ch] mt-2">
              {challenge?.description}
            </p>
            {/* Tags */}
            <div className="text-sm text-muted-foreground mt-4 flex gap-2">
              {challenge?.tags?.map((tag, index) => (
                <span className="badge" key={index}>
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          {posts.map((post, index) => (
            <PostCard
              key={index}
              content={post.content}
              image={post.image}
              link={post.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default IndividualChallenge;
