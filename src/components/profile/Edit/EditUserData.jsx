"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { editProfileSchema } from "@/schema/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import { useEditUserMutation } from "@/hooks/mutations/useEditUserMutation";
import { Loader } from "lucide-react";

function EditUserData() {
  const { data: userData, isLoading, isError, error } = useUserQuery();
  const { mutate: editUser, status } = useEditUserMutation();
  const { toast } = useToast();
  const route = useRouter();

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: "",
      fullName: "",
      bio: "",
      location: "",
      dob: "",
    },
  });
  const { reset, watch } = form;

  useEffect(() => {
    if (userData) {
      reset({
        username: userData?.username || "",
        fullName: userData?.fullName || "",
        bio: userData?.bio || "",
        location: userData?.location || "",
        dob: userData?.dob || "",
      });
    }
  }, [userData, reset]); // Only trigger when `userData.data` changes

  // Watch form values for changes
  const watchedValues = watch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const defaultValues = form.formState.defaultValues;
    const isChanged = Object.keys(defaultValues).some(
      (key) => watchedValues[key] !== defaultValues[key]
    );

    setIsButtonDisabled(!isChanged); // Disable button if no changes are made
  }, [watchedValues, form.formState.defaultValues]);

  // back button
  const backButton = () => {
    // form.reset();
    route.back();
  };

  const onSubmit = (data) => {
    editUser(
      {
        userId: userData?._id,
        updatedData: data,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Profile updated successfully!",
          });
          route.push(`/profile/${userData?.username}`);
        },
        onError: (error) => {
          console.error("Error in form submission:", error);
          // console.log(error.response);
          toast({
            title: "Error",
            description: error.message || "An error occurred.",
            variant: "destructive",
          });
        },
      }
    );
  };
  // Loading state check, don't render the form until data is fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl p-2 lg:p-0"
        >
          {/* username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="fullName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* dob */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="date"
                    placeholder="date of birth"
                    className="border border-border p-2 bg-background w-full rounded-md dark:text-neutral-400"
                    value={
                      field.value
                        ? format(new Date(field.value), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? value : undefined); // Handle raw strings
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Back button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={backButton}
            >
              Cancel
            </Button>
            {/* submit form */}
            <Button
              type="submit"
              size="lg"
              disabled={isButtonDisabled || status === "pending"}
            >
              {status === "pending" ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                "Update profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditUserData;
