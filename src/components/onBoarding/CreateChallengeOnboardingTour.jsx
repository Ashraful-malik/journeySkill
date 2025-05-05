"use client";
import { useGlobalUser } from "@/context/userContent";
import { postOnboarding } from "@/lib/api/onboarding";
import { useTheme } from "next-themes";
import React from "react";
import { Joyride, STATUS } from "react-joyride";

const step = [
  {
    target: '[data-tour="challenge-banner-image"]',
    content: "Upload a banner image for your challenge.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="challenge-name"]',
    content: "Enter a catchy name for your challenge.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="challenge-description"]',
    content: "Write what this challenge is about.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="date-range"]',
    content: "Choose the date range. Days will be auto-calculated.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="tags"]',
    content: "Add some tags for better discovery.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="is-public"]',
    content: "Set if you want this challenge to be public.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="submit-button"]',
    content: "Click here when you're ready to create the challenge!",
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

const ChallengeOnboardingTour = ({ run, setRun }) => {
  const { theme } = useTheme();
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;
  const handleJoyrideCallback = async (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      // Handle the end of the tour
      setRun(false);
      await postOnboarding(userId, "challengePage");
    }
  };
  return (
    <Joyride
      run={run}
      steps={step}
      continuous
      scrollToFirstStep
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

export default ChallengeOnboardingTour;
