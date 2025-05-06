"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import challengeSchema from "@/schema/challengeSchema";
import { addDays, format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TagInput from "@/components/ui/tag-input";
import { useCreateChallengeMutation } from "@/hooks/mutations/useCreateChallengeMutation";
import { useChallengeQuery } from "@/hooks/queries/useChallengeQuery";
import ChallengeBannerImageUpload from "@/components/fileUpload/BannerImageUpload";
import { useConfetti } from "@/hooks/useConfetti";
import ChallengeOnboardingTour from "@/components/onBoarding/CreateChallengeOnboardingTour";
import { getOnboarding } from "@/lib/api/onboarding";
import { useGlobalUser } from "@/context/userContent";

function CreateChallenge(onBoardingTemplate) {
  const { mutate: createChallenge, isPending } = useCreateChallengeMutation();
  const router = useRouter();
  const { toast } = useToast();
  const { smallConfetti } = useConfetti();
  const { user } = useGlobalUser();
  const userId = user.publicMetadata?.userId;

  // *this is important  to fetch challenges so its not give error.
  const { data } = useChallengeQuery();

  const [imageData, setImageData] = useState(null);
  const [isImageUploadingPending, setIsImageUploadingPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      challengeName: "",
      challengeDescription: "",
      isPublic: true,
      tags: [],
      dateRange: { from: new Date(), to: addDays(new Date(), 10) }, // Default range
      days: 10, //default no of days
      imageUrl: "",
    },
  });

  const [date, setDate] = useState(form.getValues("dateRange"));
  const selectedDays =
    date.from && date.to
      ? Math.ceil(
          (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0; // Default to 0 if `from` or `to` is undefined

  // Update `days` in the form state whenever `selectedDays` changes
  React.useEffect(() => {
    form.setValue("days", selectedDays);
  }, [selectedDays, form]);

  // handle file submit
  const onSubmit = async (challengeData) => {
    const allChallengeData = {
      ...challengeData,
      imageUrl: imageData?.secure_url || "", // Ensure fallback for missing imageUrl
      banner: {
        imageUrl: imageData?.secure_url || "", // Ensure fallback for missing imageUrl
        ImagePublicId: imageData?.public_id || "",
      },
    };
    createChallenge(
      { allChallengeData },
      {
        onSuccess: (data) => {
          smallConfetti(); // 🎉 celebrate
          toast({
            title: "Your Challenge is Live! 🎉",
            description:
              "You've successfully created a new challenge. Time to inspire and engage",
          });
          router.push(`/challenges/analytics/${data?._id}`);
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

  // Access error for days specifically.
  const daysError = form.formState.errors.days;

  //=========== new user onboarding=============
  const [runTour, setRunTour] = useState(null);
  // check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      const response = await getOnboarding(userId, "challengePage");
      if (response?.data) {
        const onboardingRequired = !response.data.completed;
        setRunTour(onboardingRequired);

        if (onboardingRequired) {
          form.reset({
            challengeName: "Learning React in 7 days",
            challengeDescription:
              "I'm taking on the challenge to learn React in 7 days. I'll be dedicating 1 hour each day to learning and building projects. Join me on this journey and let's learn together.",
            isPublic: true,
            tags: ["#react", "#javascript"],
            dateRange: { from: new Date(), to: addDays(new Date(), 6) },
            days: 7,
            imageUrl: "",
          });
        }
      } else {
        setRunTour(false);
      }
    };
    checkOnboarding();
  }, [userId, form]);

  return (
    <>
      {runTour !== null && (
        <ChallengeOnboardingTour run={runTour} setRun={setRunTour} />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl p-2 "
        >
          {/* File Upload */}
          <FormField
            control={form.control}
            name="imageUrl" // Name it based on how you want the image to be handled in form data
            render={({ field }) => (
              <FormItem data-tour="challenge-banner-image">
                <FormLabel>Upload Banner Image</FormLabel>
                <ChallengeBannerImageUpload
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
          {/* Challenge name */}
          <FormField
            control={form.control}
            name="challengeName"
            render={({ field }) => (
              <FormItem data-tour="challenge-name">
                <FormLabel>Challenge Name</FormLabel>
                <FormDescription>Name of your challenge</FormDescription>
                <FormControl>
                  <Input placeholder="your challenge name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* challenge description */}
          <FormField
            control={form.control}
            name="challengeDescription"
            render={({ field }) => (
              <FormItem data-tour="challenge-description">
                <FormLabel>About Challenge</FormLabel>
                <FormControl>
                  <Textarea placeholder="About your challenge" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*Select no of days */}
          <FormField
            control={form.control}
            name="dateRange" // Bind the date range to the form state
            render={({ field }) => (
              <FormItem data-tour="date-range">
                <FormLabel htmlFor="dateRange">No of days</FormLabel>
                <FormDescription>
                  Choose no of days for challenge
                </FormDescription>
                <FormControl>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from || new Date()}
                          selected={date}
                          onSelect={(newDate) => {
                            const updatedDate = {
                              from: newDate?.from || date.from,
                              to: newDate?.to || newDate?.from || date.to,
                            };
                            setDate(updatedDate); // Update local state
                            form.setValue("dateRange", updatedDate); // Sync with form state
                          }}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                {/* days */}
                <p className="text-sm font-semibold">Days : {selectedDays}</p>

                {/* Only show error for the 'days' field */}
                {daysError && <FormMessage>{daysError.message}</FormMessage>}
              </FormItem>
            )}
          />
          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            data-tour="tags"
            render={({ field }) => (
              <FormItem data-tour="tags">
                <FormLabel>Add tags </FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value || []} // Provide default empty array
                    onChange={field.onChange}
                    placeholder="Add tags (e.g., #challenge, #coding)..."
                  />
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
              <FormItem data-tour="is-public">
                <div>
                  <FormLabel>Public</FormLabel>
                  <FormDescription>
                    Do you want your Challenge to be public?
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
              disabled={isPending || isImageUploadingPending}
              className="bg-accent text-white hover:bg-accent/80"
              data-tour="submit-button"
            >
              {isPending ? (
                <span className="flex gap-2 items-center">
                  <Loader className="animate-spin" size={20} /> Creating...
                </span>
              ) : (
                "Create Challenge"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default CreateChallenge;
