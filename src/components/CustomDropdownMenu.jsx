"use client";
import { Ellipsis, EllipsisVertical, Trash } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDeletePostMutation } from "@/hooks/mutations/useCreatePostMutation";
import { useToast } from "@/hooks/use-toast";
import { useDeleteChallengeMutation } from "@/hooks/mutations/useCreateChallengeMutation";

// custom dropdown menu for the card
const CustomDropdownMenu = ({
  postId,
  isDeleting,
  targetType,
  challengeId,
}) => {
  const { toast } = useToast();
  // delete comment
  const { mutate: deletePostMutation, isPending: isDeletingPost } =
    useDeletePostMutation();
  const { mutate: deleteChallengeMutation, isPending: isDeletingChallenge } =
    useDeleteChallengeMutation();
  const deletePost = (e) => {
    e.preventDefault();
    targetType === "post"
      ? deletePostMutation(
          { postId },
          {
            onSuccess: () => {
              toast({
                title: "Post deleted",
                description: "Post deleted successfully",
              });
            },
            onError: (error) => {
              toast({
                title: "Error deleting post",
                description: error.message || "An error occurred.",
                variant: "destructive",
              });
            },
          }
        )
      : deleteChallengeMutation(
          { challengeId },
          {
            onSuccess: () => {
              toast({
                title: "challenge deleted",
                description: "Challenge deleted successfully",
              });
            },
            onError: (error) => {
              console.log(error);
              toast({
                title: "Error deleting post",
                description: error.message || "An error occurred.",
                variant: "destructive",
              });
            },
          }
        );
  };
  const dropDownItems = [{ label: "Delete", icon: Trash, action: deletePost }];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          {dropDownItems.map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={item.action}
              disabled={isDeleting || isDeletingPost || isDeletingChallenge}
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
  );
};
export default CustomDropdownMenu;
