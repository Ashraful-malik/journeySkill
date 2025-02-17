import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Bookmark, Eye, Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import CustomDropdownMenu from "../CustomDropdownMenu";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import PostCardSkeleton from "../skeleton/card/PostCardSkeleton";
import { useToast } from "@/hooks/use-toast";

function PostCard({
  content,
  image,
  linkUrl,
  className,
  postId,
  createdAt,
  owner,
  challenge,
  viewCount,
  likesCount: initialLikesCount,
  isLiked: initialIsLiked,
  onLike,
  onUnlike,
  commentCount,
  optimistic = false,
  viewsLoading,
  likeLoading = true,
  isDeleting = false,
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  const handleToggleLike = () => {
    if (isLiked) {
      onUnlike(); // Call the parent-provided function for unlike
      setLikesCount((prev) => Math.max(prev - 1, 0));
    } else {
      onLike(); // Call the parent-provided function for like
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked); // Optimistic update for immediate UI feedback
  };

  if (optimistic) return <PostCardSkeleton />;
  return (
    <Card
      className={`border rounded-none ${className} ${
        isDeleting && "opacity-50 pointer-events-none"
      }`}
      data-post-id={postId}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar aria-label={`User Avatar: ${owner?.fullName}`}>
              <AvatarImage
                src={owner?.profileImage?.imageUrl}
                alt={owner?.username}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${owner?.username}`}>
                <p className="hover:underline">{owner?.fullName}</p>
              </Link>
              <p className="text-sm text-muted-foreground">
                @{owner?.username}
              </p>
            </div>
          </div>
          {/* custom dropdown menu */}
          <CustomDropdownMenu
            postId={postId}
            isDeleting={isDeleting}
            targetType="post"
          />
        </CardTitle>
        <CardDescription>
          {new Date(createdAt).toDateString()}
          <Link href={`/challenges/${challenge?._id}`} className="w-fit">
            <Badge variant="secondary" className="w-fit max-w-xs line-clamp-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{challenge?.challengeName}</TooltipTrigger>
                  <TooltipContent>View challenge details</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Badge>
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {image && (
          <Image
            src={image}
            className="w-full h-auto object-cover rounded-md"
            height={500}
            width={500}
            loading="lazy"
            alt="Post content image"
          />
        )}
        <div className={`content ${image && "mt-4"}`}>
          <p className="leading-7 text-base">{content}</p>
          {linkUrl && (
            <Link
              href={linkUrl}
              target="_blank"
              className="text-sm hover:underline text-blue-500"
            >
              {linkUrl}
            </Link>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 text-muted-foreground">
            {/* Toggle Like Button */}

            <button
              onClick={handleToggleLike}
              className="flex items-center gap-2 cursor-pointer"
              disabled={likeLoading}
            >
              <Heart
                size={20}
                className={
                  isLiked ? "text-red-500 fill-current" : "text-gray-500"
                }
                style={{
                  animation: likeLoading ? "pulse 1s ease-in-out infinite" : "",
                }}
              />
              <span className="text-sm">{likesCount}</span>
            </button>

            <Link href={`comment/${postId}/?type=post`}>
              <button className="flex items-center gap-2 cursor-pointer">
                <MessageCircle size={20} className="hover:text-primary" />
                <span className="text-sm">{commentCount}</span>
              </button>
            </Link>

            <div className="flex items-center gap-2 cursor-pointer">
              <Eye
                size={20}
                className={`hover:text-primary ${
                  viewsLoading && "animate-pulse"
                }`}
              />
              <span className="text-sm">{viewCount}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
