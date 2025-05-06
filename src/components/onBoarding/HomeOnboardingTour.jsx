"use client";

import { useGlobalUser } from "@/context/userContent";
import { postOnboarding } from "@/lib/api/onboarding";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Joyride, STATUS } from "react-joyride";

const steps = [
  {
    target: "body", // Welcome screen centered
    placement: "center",
    disableBeacon: true,
    content: (
      <div className="text-center max-w-xs mx-auto">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to JourneySkill 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          Start by creating your first challenge to begin your learning journey.
        </p>
      </div>
    ),
  },
  {
    target: ".nav-create",
    content:
      "Click here to create your first challenge and start tracking progress",
    disableBeacon: true,
  },
];

const getJoyrideStyles = (theme) => ({
  options: {
    zIndex: 10000,
    arrowColor: theme === "dark" ? "#111" : "#fff",
    backgroundColor: theme === "dark" ? "#111" : "#fff",
    textColor: theme === "dark" ? "#fff" : "#000",
    primaryColor: "#4F46E5",
  },
});

const HomeOnboardingTour = ({ run, setRun }) => {
  const { user } = useGlobalUser();
  const { theme } = useTheme();
  const router = useRouter();
  const userId = user?.publicMetadata?.userId;

  const handleJoyrideCallback = async (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      setRun(false);
      await postOnboarding(userId, "homePage");
      router.push("/create?tab=create-challenge");
    }
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      disableBeacon
      callback={handleJoyrideCallback}
      styles={getJoyrideStyles(theme)}
      locale={{
        back: "Back",
        close: "Close",
        last: "Start Challenge",
        next: "Next",
        skip: "Skip",
      }}
    />
  );
};

export default HomeOnboardingTour;
