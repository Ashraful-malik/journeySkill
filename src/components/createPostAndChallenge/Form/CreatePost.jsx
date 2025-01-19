"use client";
import React, { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { postSchema } from "@/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PostImageUpload from "@/components/fileUpload/PostImageUpload";
import { useCreatePostMutation } from "@/hooks/mutations/useCreatePostMutation";
import { Loader } from "lucide-react";
import { useGlobalUser } from "@/context/userContent";

function CreatePost({ userChallenges }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  // all user challenges
  const allUserChallenges = userChallenges?.challenges?.map((challenge) => ({
    name: challenge.challengeName,
    value: challenge._id,
  }));
  const [imageData, setImageData] = useState(null);
  const navigate = useRouter();
  const { toast } = useToast();
  const { mutate: createPost, isPending } = useCreatePostMutation();
  const [isImageUploadingPending, setIsImageUploadingPending] = useState(false);
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      text: "",
      link: "",
      challengeId: "",
      isPublic: true,
      imageUrl: "", // Add this field to prevent any undefined values
    },
  });
  const selectChallenge = form.watch("challengeId");
  const isChallengeSelected = useMemo(
    () => !!selectChallenge,
    [selectChallenge]
  );

  const onSubmit = async (data) => {
    const postData = {
      ...data,
      imageUrl: imageData?.secure_url || "", // Ensure fallback for missing imageUrl
      imagePublicId: imageData?.public_id || "", // Ensure fallback for missing imagePublicId
      userId,
    };

    createPost(
      { postData },
      {
        onSuccess: () => {
          toast({
            title: "Post created successfully",
            description: "Post created successfully",
          });
          navigate.push("/home");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "An error occurred.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl p-2 "
        >
          {!isChallengeSelected && (
            <p className="text-red-500 mb-4 text-sm">
              Please select a challenge to create a post.
            </p>
          )}
          {/* select challenge name  */}
          <FormField
            control={form.control}
            name="challengeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Challenge</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Challenge" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Your Challenges</SelectLabel>
                      {allUserChallenges?.map((challenge) => (
                        <SelectItem
                          className="max-w-2xl line-clamp-1 overflow-hidden "
                          value={challenge.value}
                          key={challenge.value}
                        >
                          {challenge.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the challenge you want to associate with this post.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset disabled={!isChallengeSelected} className="space-y-4">
            {/* text */}
            <FormField
              control={form.control}
              disabled={!isChallengeSelected}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      {...field}
                      className="resize-none h-44"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormDescription>Add a link to your post</FormDescription>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* File Upload */}
            <FormField
              control={form.control}
              name="imageUrl" // Name it based on how you want the image to be handled in form data
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <PostImageUpload
                    onUploadSuccess={(data) => {
                      // Check if 'data' is defined and has valid properties
                      if (data?.secure_url && data?.public_id) {
                        setImageData(data); // Only set imageData if data is valid
                        field.onChange(data.secure_url);
                      } else {
                        toast({
                          title: "Image upload error",
                          message: "Please try again",
                          variant: "destructive",
                        });
                      }
                    }}
                    onUploadPending={(isPending) => {
                      setIsImageUploadingPending(isPending);
                    }}
                  />
                </FormItem>
              )}
            />
            {/* is public */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="">
                  <div>
                    <FormLabel>Public</FormLabel>
                    <FormDescription>
                      Do you want your post to be public?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* submit button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !isChallengeSelected ||
                  !form.formState.isValid ||
                  isImageUploadingPending
                }
              >
                {isPending && <Loader className="animate-spin mr-2" />} Create
                Post
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}

export default CreatePost;
