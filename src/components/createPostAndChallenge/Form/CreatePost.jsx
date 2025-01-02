"use client";
import React, { useState } from "react";
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
import { useUser } from "@clerk/nextjs";

function CreatePost() {
  // Dummy Challenge name and value
  const challenges = [
    { name: "Challenge 1", value: "challenge-1" },
    { name: "Challenge 2", value: "challenge-2" },
    { name: "Challenge 3", value: "challenge-3" },
  ];

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      text: "",
      url: "",
      selectChallenge: "",
      isPublic: true,
    },
  });
  const { user } = useUser();
  // console.log("Clerk user=====>", user);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl p-2 "
        >
          {/* select challenge name  */}

          <FormField
            control={form.control}
            name="selectChallenge"
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
                      {challenges.map((challenge, idx) => (
                        <SelectItem value={challenge.value} key={idx}>
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
          {/* text */}
          <FormField
            control={form.control}
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
            name="url"
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
          {/* file upload */}
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload image</FormLabel>
                <FormControl>
                  <PostImageUpload />
                </FormControl>
                <FormMessage />
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
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreatePost;
