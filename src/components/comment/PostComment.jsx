"use client";
import React, { useEffect, useRef } from "react";
import PostCard from "../cards/PostCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Comment from "./view/Comment";
import { usePostByIdQuery } from "@/hooks/queries/usePostQuery";
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
import PostCardSkeleton from "../skeleton/card/PostCardSkeleton";
import { CommentSkeleton } from "../skeleton/comment/CommentSkeleton";

function PostComment({ id }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  console.log(userId);
  const { toast } = useToast();
  // get post by id
  const { data: postData, isLoading: postLoading } = usePostByIdQuery(id);
  // create comment
  const { mutate: createComment } = useCreateCommentMutation({ id });
  //get comments
  const {
    data: comments,
    isLoading: loadingComments,
    fetchNextPage,
    hasNextPage,
  } = useCommentByIdQuery({
    id,
    contentType: "Post",
  });
  console.log(comments);
  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage || loadingComments) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, loadingComments, fetchNextPage]);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      contentType: "Post",
    },
  });
  const onSubmit = async (data) => {
    try {
      const commentData = {
        userId: userId,
        id,
        ...data,
      };
      await createComment(
        { commentData },
        {
          onError: (error) => {
            console.log(error);
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
      console.log(error);
    }
  };
  if (postLoading) {
    return (
      <div className="w-full border-r border-l mt-2 max-w-2xl">
        <PostCardSkeleton />
        {/* comment section */}
        <section className="flex flex-col  ">
          {/* comment input */}
          <CommentSkeleton />
        </section>
      </div>
    );
  }
  return (
    <div className="w-full border-r border-l mt-2 max-w-2xl">
      <PostCard
        className="border-r-0 border-l-0"
        content={postData?.content}
        image={postData?.image}
        linkUrl={postData?.link}
        createdAt={postData?.createdAt}
        owner={postData?.owner}
        challenge={postData?.challengeId}
        postId={postData?._id}
        key={postData?._id}
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
                        className="resize-none w-full border-r-0 border-l-0 rounded-none h-12 shadow-none border-t-0"
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
        <div key={id}>
          {loadingComments && <div>Loading .....</div>}
          {comments?.pages
            ?.flatMap((page) => page.comments)
            ?.map((comment) => (
              <Comment
                key={comment._id}
                commentBy={comment.commentBy}
                commentId={comment._id}
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                comment={comment.content}
                optimistic={comment.optimistic}
                postId={id}
                isDeleting={comment.isDeleting}
              />
            ))}
        </div>
        {hasNextPage && <div ref={loadMoreRef}>Loading more...</div>}
      </section>
    </div>
  );
}

export default PostComment;
