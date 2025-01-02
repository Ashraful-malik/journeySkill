"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

function EditUserData() {
  const { toast } = useToast();
  const route = useRouter();
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
      location: "",
      dob: "",
    },
  });

  // Watch form values for changes
  const watchedValues = form.watch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  // Check if values have changed from defaultValues
  useEffect(() => {
    const defaultValues = form.formState.defaultValues;
    const isChanged = Object.keys(defaultValues).some(
      (key) => watchedValues[key] !== defaultValues[key]
    );

    setIsButtonDisabled(!isChanged); // Disable button if no changes are made
  }, [watchedValues, form.formState.defaultValues]);

  // back button
  const backButton = () => {
    form.reset();
    route.back();
  };
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl p-2 lg:p-0"
        >
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
                      field.onChange(value ? value : undefined); // Pass raw string to z.preprocess
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
            <Button type="submit" size="lg" disabled={isButtonDisabled}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditUserData;
