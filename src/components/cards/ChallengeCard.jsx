import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartColumnStacked,
  Eye,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import CustomDropdownMenu from "../CustomDropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ChallengeCardSkeleton from "../skeleton/card/ChallengesCardSkeleton";
import ShareButtons from "../ShareButtons";
function ChallengeCard({
  id,
  description,
  title,
  tags,
  challengeOwner,
  createdAt,
  viewsCount,
  likesCount: initialLikesCount,
  isLiked: initialIsLiked,
  onLike,
  onUnlike,
  commentCount,
  optimistic = false,
  isDeleting = false,
  userId,
  className,
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const challengeCreatedAt = new Date(createdAt).toDateString();

  // Full URL
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/challenges/${id}`;

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);
  const handleToggle = () => {
    if (isLiked) {
      onUnlike(); // Call the parent-provided function for unlike
      setLikesCount((prev) => Math.max(prev - 1, 0));
    } else {
      onLike(); // Call the parent-provided function for like
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked); // Optimistic update for immediate UI feedback
  };
  if (optimistic) return <ChallengeCardSkeleton />;
  return (
    <Card
      className={`rounded-sm ${
        isDeleting && "opacity-50 pointer-events-none"
      } ${className}`}
    >
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center  justify-between">
          {/* profile details */}

          <div className="flex items-center space-x-2">
            <Avatar aria-label="User Avatar">
              <AvatarImage
                src={challengeOwner?.profileImage?.imageUrl}
                alt={challengeOwner?.username}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {/* user username and name */}
            <div>
              <Link href={`/profile/${challengeOwner?.username}`}>
                <p id="author-name " className="hover:underline">
                  {challengeOwner?.fullName}
                </p>
              </Link>
              <p className="text-sm text-muted-foreground" id="author-username">
                {challengeOwner?.username}
              </p>
            </div>
          </div>
          {/* dropdown menu */}
          {userId === challengeOwner?._id && (
            <div>
              {/* custom dropdown menu for the card */}
              <CustomDropdownMenu
                challengeId={id}
                isDeleting={isDeleting}
                targetType="challenge"
              />
            </div>
          )}
        </CardTitle>
        <CardDescription aria-labelledby="author-name">
          {challengeCreatedAt}
        </CardDescription>
      </CardHeader>

      {/* Content */}
      {/* link to individual challenge */}
      <Link href={`/challenges/${id}`}>
        <CardContent className=" ">
          <div className="content">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-4 text-base">
              {description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {tags?.map((hashtags, idx) => (
                <p
                  key={idx}
                  className="text-sm font-bold text-muted-foreground cursor-default"
                >
                  {hashtags.tag}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          {/* Left Actions */}
          <div className="flex items-center space-x-4 text-muted-foreground">
            <button
              className="flex items-center gap-2 cursor-pointer "
              aria-label="Like this post"
              onClick={handleToggle}
            >
              <Heart
                size={20}
                className={
                  isLiked ? "text-red-500 fill-current" : "text-gray-500"
                }
              />
              <span className="text-sm" aria-hidden="true">
                {likesCount}
              </span>
            </button>
            {/* comment */}
            <Link href={`/comment/${id}/?type=challenge`}>
              <button
                className="flex items-center gap-2 cursor-pointer"
                aria-label="Comment on this post"
              >
                <MessageCircle size={20} className="hover:text-primary" />
                <span className="text-sm" aria-hidden="true">
                  {commentCount}
                </span>
              </button>
            </Link>
            {/* views */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              aria-label="View this post"
            >
              <Eye size={20} />
              <span className="text-sm" aria-hidden="true">
                {viewsCount}
              </span>
            </div>
          </div>

          {/* Right side Action */}
          <div className="flex gap-2">
            {userId === challengeOwner?._id && (
              <div className="flex items-center space-x-4">
                <TooltipProvider arial-label="challenge analytics">
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={`/challenges/analytics/${id}`}>
                        <ChartColumnStacked size={20} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Challenge Analytics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <div className="text-muted-foreground ">
              <ShareButtons
                url={fullUrl}
                title={title}
                description={description}
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChallengeCard;
