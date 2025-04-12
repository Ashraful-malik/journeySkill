"use client";
import React, { useEffect, useRef } from "react";
import PostCard from "../cards/PostCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Comment from "./view/Comment";
import { useForm } from "react-hook-form";
import { commentSchema } from "@/schema/commentSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useCreateCommentMutation } from "@/hooks/mutations/useCommentMutation";
import { useGlobalUser } from "@/context/userContent";
import { useToast } from "@/hooks/use-toast";
import { useCommentByIdQuery } from "@/hooks/queries/useCommentQuery";
import ChallengeCard from "../cards/ChallengeCard";
import { useChallengeByIdQuery } from "@/hooks/queries/useChallengeQuery";
import PostCardSkeleton from "../skeleton/card/PostCardSkeleton";
import { CommentSkeleton } from "../skeleton/comment/CommentSkeleton";
import BackButton from "../BackButton";

function ChallengeComment({ id }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const { toast } = useToast();
  // get challenge by id
  const { data: challengeData, isLoading: challengeLoading } =
    useChallengeByIdQuery(id);
  // create comment
  const { mutate: createComment } = useCreateCommentMutation({ id });
  //get comments
  const {
    data: comments,
    isLoading: loadingComments,
    fetchNextPage,
    hasNextPage,
  } = useCommentByIdQuery({ id, contentType: "Challenge" });

  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage || loadingComments) return;
    const loadMoreElement = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [hasNextPage, loadingComments, fetchNextPage]);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      contentType: "Challenge",
    },
  });
  const onSubmit = async (data) => {
    try {
      const commentData = {
        userId: userId,
        id,
        ...data,
      };
      createComment(
        { commentData },
        {
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "An error occurred.",
              variant: "destructive",
            });
          },
          onSuccess: () => {
            toast({
              title: "Comment created",
              description: "Comment created successfully",
            });
          },
        }
      );
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };
  if (challengeLoading) {
    return (
      <div className="w-full border-r border-l mt-2 max-w-2xl">
        <PostCardSkeleton />
        {/* comment section */}
        <section className="flex flex-col ">
          {/* comment input */}
          <CommentSkeleton />
        </section>
      </div>
    );
  }
  return (
    <div className="w-full mt-2 max-w-2xl mx-auto lg:mx-0 ">
      <div className="mb-2">
        <BackButton />
      </div>
      <ChallengeCard
        key={challengeData?._id}
        id={challengeData?._id}
        description={challengeData?.description}
        title={challengeData?.challengeName}
        tags={challengeData?.tags}
        challengeDays={challengeData?.days}
        challengeOwner={challengeData?.challengeOwner}
        createdAt={challengeData?.createdAt}
        hideStatus={true}
      />
      {/* comment section */}
      <section className="flex flex-col gap-2 ">
        {/* comment input */}
        <div className="flex items-center ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex item-center  w-full justify-between"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Type comment ..."
                        className="resize-none w-full rounded-none h-12 shadow-none border-t-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="h-12 rounded-none">
                Comment
              </Button>
            </form>
          </Form>
        </div>
        {/* comments */}
        {loadingComments && <CommentSkeleton />}
        {comments?.pages
          ?.flatMap((page) => page?.comments || []) // Ensure it's an array
          ?.map((comment, index) => {
            return (
              <Comment
                key={comment._id || `fallback-${index}`} // Ensure unique key
                commentBy={comment.commentBy}
                commentId={comment._id}
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                comment={comment.content}
                optimistic={comment.optimistic}
                postId={id}
                isDeleting={comment.isDeleting}
                userId={userId}
              />
            );
          })}
        {hasNextPage && <div ref={loadMoreRef}>Loading more...</div>}
      </section>
    </div>
  );
}

export default ChallengeComment;
