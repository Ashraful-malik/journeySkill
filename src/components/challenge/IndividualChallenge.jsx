import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChartColumnStacked, Info, User } from "lucide-react";
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
import {
  useChallengePostsQuery,
  useEngagementMetrics,
} from "@/hooks/queries/usePostQuery";
import { useCrateViewMutation } from "@/hooks/mutations/useViewMutation";
import { useGlobalUser } from "@/context/userContent";
import IndividualChallengeSkeleton from "../skeleton/challenges/IndividualChallengeSkeleton";
import PostCardSkeleton from "../skeleton/card/PostCardSkeleton";
import { useBatchLikeMutation } from "@/hooks/mutations/useBatchLikeMutation";
import { Virtuoso } from "react-virtuoso";

const calculateProgress = ({ tasksRequired, tasksCompleted }) => {
  if (!tasksRequired || tasksRequired === 0) return 0;
  const progress = (tasksCompleted / tasksRequired) * 100;
  return Math.min(progress, 100);
};

function IndividualChallenge({ challengeId }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;

  const { data: challenge, isLoading: challengeLoading } =
    useChallengeByIdQuery(challengeId);

  const {
    data: challengePosts,
    isLoading: postLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChallengePostsQuery(challengeId);

  const challengeOwner = challenge?.challengeOwner;
  const challengeStartingDate = new Date(
    challenge?.startDate
  ).toLocaleDateString();

  const isPostAvailable = !postLoading && challengePosts?.pages?.length > 0;
  const progress = calculateProgress({
    tasksRequired: challenge?.tasksRequired,
    tasksCompleted: challenge?.tasksCompleted,
  });

  // ---------------record views  function------------
  const { mutate: recordViews } = useCrateViewMutation();
  const [timeSpent, setTimeSpent] = useState(0);
  const MIN_VIEW_THRESHOLD = 5000;
  const [hasRecordedView, setHasRecordedView] = useState(false);

  useEffect(() => {
    let interval;
    let startTime = Date.now();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTime = Date.now();
        interval = setInterval(() => setTimeSpent((pre) => pre + 1000), 1000);
      } else {
        clearInterval(interval);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!hasRecordedView && timeSpent >= MIN_VIEW_THRESHOLD) {
      recordViews({
        viewData: {
          contentType: "Challenge",
          postIds: [challengeId],
          userId: userId,
        },
      });
      setHasRecordedView(true);
    }
  }, [timeSpent, hasRecordedView, userId, challengeId]);

  // ----------------fetching all post views,likes and comments---------------

  const postIds = useMemo(() => {
    return (
      challengePosts?.pages?.flatMap((page) =>
        page.posts?.map((post) => post._id)
      ) || []
    );
  }, [challengePosts]);
  const { data: engagementData, isLoading: engagementLoading } =
    useEngagementMetrics({
      postIds,
      userId,
      targetType: "Post",
      contentType: "Post",
    });

  // -----------------------Create Like logic--------------------------------
  const { addToBatch } = useBatchLikeMutation();
  const handleLike = (postId, operation) => {
    addToBatch({
      targetId: postId,
      postIds: postIds,
      userId: userId,
      operation: operation,
      targetType: "Post",
    });
  };
  const MemoizedPostCard = useCallback(
    (post) => {
      const engagement = engagementData?.[post._id] || {};
      return (
        <PostCard
          key={post._id}
          linkUrl={post?.link}
          content={post?.text}
          createdAt={post?.createdAt}
          image={post?.image}
          owner={post?.owner}
          challenge={post?.challengeId}
          postId={post?._id}
          onLike={() => handleLike(post._id, "like")}
          onUnlike={() => handleLike(post._id, "unlike")}
          viewCount={engagement.views}
          commentCount={engagement.comments}
          likesCount={engagement.likes?.count || 0}
          isLiked={engagement.likes?.isLiked || false}
          likeLoading={engagementLoading}
          isDeleting={post.isDeleting}
          userId={userId}
        />
      );
    },
    [engagementData, engagementLoading, userId]
  );
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
        </header>

        {/* Progress Bar Section */}
        <div aria-labelledby="progress-label" className="my-4">
          <div className="flex items-center justify-between mb-2">
            <p id="progress-label" className="text-sm text-muted-foreground">
              Progress: {progress}% ({challenge?.tasksCompleted} out of{" "}
              {challenge?.tasksRequired} tasks completed).
            </p>
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

        <div className="h-full">
          {postLoading ? (
            <PostCardSkeleton />
          ) : !isPostAvailable ? (
            <div className="flex items-center justify-center">
              <p className="text-base font-semibold">
                No posts available for this challenge
              </p>
            </div>
          ) : (
            <Virtuoso
              className=" h-[calc(100vh-200px)]"
              useWindowScroll
              data={[
                ...(challengePosts?.pages?.flatMap((page) =>
                  page.posts.map((post) => ({ ...post, key: post._id }))
                ) || []),
                ...(isFetchingNextPage
                  ? new Array(3).fill({ isSkeleton: true })
                  : []),
              ]}
              endReached={hasNextPage ? fetchNextPage : undefined}
              overscan={500}
              itemContent={(_, post) =>
                post.isSkeleton ? <PostCardSkeleton /> : MemoizedPostCard(post)
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default IndividualChallenge;
