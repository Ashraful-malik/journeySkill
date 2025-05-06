"use client";
import { useGlobalUser } from "@/context/userContent";
import { postOnboarding } from "@/lib/api/onboarding";
import { useTheme } from "next-themes";
import React from "react";
import { Joyride, STATUS } from "react-joyride";

const step = [
  {
    target: '[data-tour="heading"]', // Page title
    content:
      "Welcome to your Challenge Dashboard! Here's where you track your journey, progress, and build your streaks. Let’s walk you through it.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="challenge-completion"]',
    content:
      " Need help? Click this button anytime to see how to complete the challenge.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="overview"]',
    content:
      "The overview gives you a snapshot: how many tasks you've done, your current streak, and how many days are left. Everything you need to stay on track!",
    disableBeacon: true,
  },
  {
    target: '[data-tour="task-chart"]',
    content:
      "This graph shows your daily task completion. Aim to fill this up by checking in every day!",
    disableBeacon: true,
  },
  {
    target: '[data-tour="heatmap"]',
    content:
      "Your activity heatmap visualizes consistency over time. The brighter the streak, the closer you are to your goal!",
    disableBeacon: true,
  },
  {
    target: '[data-tour="challenge-details"]',
    content:
      "Here you can see your challenge status, when you started, and when you last logged progress.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="insights"]',
    content:
      "Smart insights help you finish strong — they track how many tasks are left, how many days you’ve been consistent, and offer personalized encouragement.",
    disableBeacon: true,
    placement: "top",
  },

  {
    target: ".nav-create", // "Create" in sidebar (optional final CTA)
    content:
      "Now that you've finished the tour, create your first post by clicking 'Create' in the sidebar.",
    disableBeacon: true,
    placement: "right",
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

const ChallengeAnalyticsTour = ({ run, setRun }) => {
  const { user } = useGlobalUser();
  const { theme } = useTheme(); // returns 'light' or 'dark'

  const userId = user?.publicMetadata?.userId;
  const handleJoyrideCallback = async (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      // Handle the end of the tour
      setRun(false);
      await postOnboarding(userId, "analyticsPage");
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

export default ChallengeAnalyticsTour;
