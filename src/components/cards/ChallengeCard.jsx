import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bookmark,
  ChartColumnStacked,
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
import PropTypes from "prop-types";
function ChallengeCard({
  id,
  description,
  title,
  tags,
  challengeDays,
  challengeOwner,
  createdAt,
}) {
  const challengeCreatedAt = new Date(createdAt).toDateString();
  const handleLike = () => {
    console.log("liked");
  };
  const handleComment = () => {
    console.log("commented");
  };
  return (
    <Card className=" rounded-sm">
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center  justify-between">
          {/* profile details */}

          <div className="flex items-center space-x-2">
            <Avatar aria-label="User Avatar: Ashraful Malik">
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
          <div>
            <CustomDropdownMenu />
          </div>
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
              onClick={handleLike}
              className="flex items-center gap-2 cursor-pointer "
              aria-label="Like this post"
            >
              <Heart size={20} className="hover:text-red-500" />
              <span className="text-sm" aria-hidden="true">
                100
              </span>
            </button>
            <Link href="/comment/456?type=challenge">
              <button
                onClick={handleComment}
                className="flex items-center gap-2 cursor-pointer"
                aria-label="Comment on this post"
              >
                <MessageCircle size={20} className="hover:text-primary" />
                <span className="text-sm" aria-hidden="true">
                  200
                </span>
              </button>
            </Link>
          </div>

          {/* Right side Action */}
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center gap-2 cursor-pointer text-muted-foreground"
              aria-label="Save this post"
            >
              <Bookmark size={20} />
              <span className="text-sm " aria-hidden="true">
                Save
              </span>
            </button>

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
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChallengeCard;
ChallengeCard.prototype = {
  id: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  tags: PropTypes.array,
  challengeDays: PropTypes.number,
  challengeOwner: PropTypes.object,
  createdAt: PropTypes.string,
};
