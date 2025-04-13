"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import PostImageUpload from "@/components/fileUpload/PostImageUpload";
import { useCreatePostMutation } from "@/hooks/mutations/useCreatePostMutation";
import { Loader } from "lucide-react";
import { useGlobalUser } from "@/context/userContent";
// import { usePostQuery } from "@/hooks/queries/usePostQuery";
import { useChallengeByIdQuery } from "@/hooks/queries/useChallengeQuery";
import TiptapWrapper from "@/components/richTextEditor/TiptapWrapper";

// rich text editor models

function CreatePost({
  userChallenges,
  isChallengeLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  // all user challenges
  const allUserChallenges = userChallenges?.map((challenge) => ({
    name: challenge.challengeName,
    value: challenge._id,
  }));

  const [imageData, setImageData] = useState(null);
  const navigate = useRouter();
  const { toast } = useToast();

  const { mutate: createNewPost, isPending } = useCreatePostMutation();

  const [isImageUploadingPending, setIsImageUploadingPending] = useState(false);
  const form = useForm({
    resolver: zodResolver(postSchema),
    mode: "onChange",
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

  // ----------Get individual challenge details with selected Challenge id-------
  const { data: individualChallenge } = useChallengeByIdQuery(selectChallenge);

  const [challengeIsCompleted, setChallengeIsCompleted] = useState(false);
  const [isChallengeActive, setIsChallengeActive] = useState(false);

  useEffect(() => {
    if (individualChallenge) {
      const isCompleted = individualChallenge?.isCompleted;
      const isActive =
        new Date() >= new Date(individualChallenge?.startDate) &&
        new Date() <= new Date(individualChallenge?.endDate);

      setChallengeIsCompleted(isCompleted);
      setIsChallengeActive(isActive);
    }
  }, [individualChallenge]);

  // setting image to imageData
  useEffect(() => {
    if (
      imageData?.secure_url && // Make sure image data exists
      !form.getValues("imageUrl") // Only set it if it's not already set
    ) {
      form.setValue("imageUrl", imageData.secure_url);
    }
  }, [imageData, form]);

  // -------submit form---------
  const onSubmit = async (data) => {
    if (!isChallengeActive && !challengeIsCompleted) {
      toast({
        title: "Challenge is Ended",
        description: "You can't post to a challenge that has already ended.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      ...data,
      imageUrl: imageData?.secure_url || "", // Ensure fallback for missing imageUrl
      ...(imageData?.public_id && { imagePublicId: imageData.public_id }),
      userId,
    };

    createNewPost(
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
          className="space-y-4 max-w-2xl p-2"
          onKeyDown={(e) => {
            // Prevent form submission on Enter key in the editor
            if (e.key === "Enter" && e.target.closest(".ProseMirror")) {
              e.preventDefault();
            }
          }}
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
                  onValueChange={(value) => {
                    if (value !== field.value) {
                      field.onChange(value); // Only update if there's an actual change
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isChallengeLoading
                            ? "Loading challenges..."
                            : "Select Challenge"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Your Challenges</SelectLabel>

                      {allUserChallenges?.map((challenge) => (
                        <SelectItem
                          className="max-w-2xl line-clamp-1 overflow-hidden  "
                          value={challenge.value}
                          key={challenge.value}
                        >
                          {challenge.name}
                        </SelectItem>
                      ))}
                      {hasNextPage && (
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="text-indigo-500 text-sm mt-2"
                        >
                          {isFetchingNextPage
                            ? "Loading..."
                            : "Load More Challenges"}
                        </button>
                      )}
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
            {/* Rich Text Editor */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post content</FormLabel>
                  <FormControl>
                    <TiptapWrapper
                      disabled={!isChallengeSelected}
                      content={field.value}
                      onChange={(html) => {
                        form.setValue("text", html, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        field.onChange(html);
                      }}
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
            <div className="space-y-2">
              <FormLabel>Upload Image</FormLabel>
              <PostImageUpload
                onUploadSuccess={(data) => {
                  if (data?.secure_url && data?.public_id) {
                    setImageData(data);
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
            </div>

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
