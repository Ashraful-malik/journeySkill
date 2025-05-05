"use client";
import { useGlobalUser } from "@/context/userContent";
import { postOnboarding } from "@/lib/api/onboarding";
import { useTheme } from "next-themes";
import React from "react";
import { Joyride, STATUS } from "react-joyride";

const step = [
  {
    target: '[data-tour="select-challenge"]',
    content:
      "Select the challenge you want this post to belong to. It keeps your progress organized and visible.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="post-editor"]',
    content:
      "Share what you did today! Be real, be specific — this helps others learn and keeps you accountable.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="link-input"]',
    content:
      "Got a project link, blog, GitHub repo, or tweet? Drop it here to showcase your work.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="image-uploader"]',
    content:
      "Upload a screenshot, diagram, or proof of work. Posts with images get more love!",
    disableBeacon: true,
  },
  {
    target: '[data-tour="public-toggle"]',
    content:
      "Make your post public if you want to inspire others in the community.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-post-button"]',
    content:
      "You're ready! Click here to publish your progress and stay consistent!",
    disableBeacon: true,
  },
];

const getJoyrideStyles = (theme) => ({
  options: {
    zIndex: 10000,
    arrowColor: theme === "dark" ? "#111" : "#fff",
    backgroundColor: theme === "dark" ? "#111" : "#fff",
    textColor: theme === "dark" ? "#fff" : "#000",
    primaryColor: theme === "dark" ? "#4F46E5" : "#4F46E5", // Tailwind green/blue
  },
});

const CreatePostOnboardingTour = ({ run, setRun }) => {
  const { user } = useGlobalUser();
  const { theme } = useTheme(); // returns 'light' or 'dark'

  const userId = user?.publicMetadata?.userId;
  const handleJoyrideCallback = async (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      // Handle the end of the tour
      setRun(false);
      await postOnboarding(userId, "postPage");
    }
  };
  return (
    <Joyride
      run={run}
      steps={step}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      disableBeacon
      callback={(data) => handleJoyrideCallback(data)}
      styles={getJoyrideStyles(theme)}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      }}
    />
  );
};

export default CreatePostOnboardingTour;
