import React, { useEffect, useState } from "react";
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
import { useChallengePostsQuery } from "@/hooks/queries/usePostQuery";
import { useCrateViewMutation } from "@/hooks/mutations/useViewMutation";
import { useGlobalUser } from "@/context/userContent";
import IndividualChallengeSkeleton from "../skeleton/challenges/IndividualChallengeSkeleton";
import PostCardSkeleton from "../skeleton/card/PostCardSkeleton";

const calculateProgress = ({ tasksRequired, tasksCompleted }) => {
  // Avoid division by zero
  if (!tasksRequired || tasksRequired === 0) {
    return 0;
  }
  const progress = (tasksCompleted / tasksRequired) * 100;
  return Math.min(progress, 100);
};

function IndividualChallenge({ challengeId }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  // fetch challenge by Id
  const { data: challenge, isLoading: challengeLoading } =
    useChallengeByIdQuery(challengeId);

  const { data: challengePosts, isLoading: postLoading } =
    useChallengePostsQuery(challengeId);

  // fetch all post of a challenge
  const challengeOwner = challenge?.challengeOwner;
  const challengeStartingDate = new Date(
    challenge?.startDate
  ).toLocaleDateString();

  const isPostAvailable = !postLoading && challengePosts?.posts.length > 0;
  const progress = calculateProgress({
    tasksRequired: challenge?.tasksRequired,
    tasksCompleted: challenge?.tasksCompleted,
  });

  // Recording views
  const { mutate: recordViews } = useCrateViewMutation();
  const [timeSpent, setTimeSpent] = useState(0);
  const MIN_VIEW_THRESHOLD = 5000; // 5 seconds in milliseconds
  const [hasRecordedView, setHasRecordedView] = useState(false);

  useEffect(() => {
    let interval;
    let startTime = Date.now();

    // Start tracking time when the page is visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTime = Date.now();
        interval = setInterval(() => {
          setTimeSpent((pre) => pre + 1000);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    };
    // Attach event listener for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Start the timer immediately
    handleVisibilityChange();

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!hasRecordedView && timeSpent >= MIN_VIEW_THRESHOLD) {
      console.log("Time Spent", timeSpent);
      recordViews({
        viewData: {
          contentType: "Challenge",
          postIds: [challengeId],
          userId: userId,
        },
      });
      setHasRecordedView(true); // Ensure we only record the view once
    }
  }, [timeSpent, hasRecordedView, userId, challengeId]);

  if (challengeLoading) {
    return <IndividualChallengeSkeleton />;
  }
  return (
    <>
      <div className="px-2 lg:px-0">
        <BackButton />
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
              This user haven&#39;t started yet! Let&#39;s cheer them on as they
              complete their first task.
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
          {postLoading && <PostCardSkeleton />}
          {!isPostAvailable && !postLoading ? (
            <div className="flex items-center justify-center">
              <p className="text-base font-semibold">
                No posts available for this challenge
              </p>
            </div>
          ) : (
            challengePosts?.posts?.map((post) => (
              <PostCard
                key={post?._id}
                content={post?.text}
                image={post?.image}
                linkUrl={post?.link}
                createdAt={post?.createdAt}
                owner={post?.owner}
                challenge={post?.challengeId}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default IndividualChallenge;
