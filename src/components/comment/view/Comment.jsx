"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCommentMutation } from "@/hooks/mutations/useCommentMutation";
import { useToast } from "@/hooks/use-toast";

import { User, Loader2, EllipsisVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const MAX_COMMENT_LENGTH = 200;

function Comment({
  createdAt,
  updatedAt,
  commentBy,
  comment,
  optimistic,
  commentId,
  postId,
  isDeleting,
}) {
  console.log("isDeleting", isDeleting);
  const { mutate: deleteCommentMutation, isPending } =
    useDeleteCommentMutation();
  const [showMore, setShowMore] = useState(false);
  const { toast } = useToast();
  const profileImage = commentBy?.profileImage?.imageUrl || null;
  const formatDate = (date, isOptimistic) => {
    if (isOptimistic) return "Just now";
    if (!date) return "Date not available";
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? "Date not available"
      : parsedDate.toLocaleDateString("en-GB").replace(/\//g, "-");
  };
  const createdAtDate = formatDate(createdAt, optimistic);

  const truncatedComment =
    comment.length > MAX_COMMENT_LENGTH && !showMore
      ? `${comment.slice(0, MAX_COMMENT_LENGTH)}...`
      : comment;

  // delete comment
  const onDelete = async (e) => {
    e.preventDefault();
    deleteCommentMutation(
      { postId, commentId },
      {
        onSuccess: () => {
          toast({
            title: "Comment deleted",
            description: "Comment deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error deleting comment",
            description: error.message || "An error occurred.",
            variant: "destructive",
          });
        },
      }
    );
  };
  // drop down item
  const dropDownItems = [
    {
      label: "Delete",
      icon: Trash2,
      action: onDelete,
    },
  ];

  return (
    <div
      className={`bg-card pt-2 pb-8 px-4 text-primary border-b relative ${
        optimistic || isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
      aria-busy={optimistic || isDeleting}
      aria-live="polite"
    >
      {(optimistic || isDeleting) && (
        <div
          className="absolute inset-0 flex justify-center items-center bg-neutral-500/50"
          aria-hidden="true"
        >
          {optimistic && (
            <Loader2
              className="w-6 h-6 animate-spin"
              arial-label="Loading...."
            />
          )}
          {isDeleting && (
            <Trash2
              size="20"
              className="text-red-500 animate-ping"
              arial-label="deleting...."
            />
          )}
        </div>
      )}

      <section className="flex gap-2 flex-col">
        {/* Avatar and Metadata */}
        <div className="flex items-center gap-2">
          <Avatar
            className="w-10 h-10 cursor-pointer border-2"
            aria-label={`Avatar of ${commentBy?.username || "loading user"}`}
          >
            <AvatarImage
              src={profileImage}
              alt={commentBy?.username || "User"}
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>

          <div className="w-full ">
            <div className="flex items-center justify-between  w-full">
              <div className="flex items-center gap-1 text-center">
                <h3 className="text-sm font-semibold">
                  {commentBy?.fullName || "Loading..."}
                </h3>
                <Link
                  href={
                    commentBy?.username ? `/profile/${commentBy.username}` : "#"
                  }
                  className="hover:underline text-sm text-muted-foreground"
                  aria-disabled={optimistic}
                >
                  {optimistic ? "loading..." : `@${commentBy?.username}`}
                </Link>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuGroup>
                      {dropDownItems.map((item, idx) => (
                        <DropdownMenuItem
                          key={idx}
                          onClick={item.action}
                          disabled={isPending || optimistic}
                          className="cursor-pointer"
                        >
                          {item.label}
                          <DropdownMenuShortcut>
                            <item.icon size={16} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="text-xs text-muted-foreground -mt-2">
              {createdAtDate}
            </div>
          </div>
        </div>

        {/* Comment Body */}
        <div className="ml-12">
          <p className={`text-sm  break-words `}>
            {truncatedComment}
            {comment.length > MAX_COMMENT_LENGTH && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-primary font-semibold hover:underline ml-2 text-sm"
                aria-expanded={showMore}
              >
                {showMore ? "Show Less" : "Show More"}
              </button>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Comment);
