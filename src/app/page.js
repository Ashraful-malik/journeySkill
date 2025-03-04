"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { AppWindow, ChartColumnIncreasing, Swords, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const heroSectionContent = {
    title: " The Developer’s Challenge Platform – Your Goals, Your Journey",
    description:
      " Create, track, and complete your own coding challenges with full accountability.",
  };

  // why Join Us section
  const whyJoinUsContent = [
    {
      id: 1,
      title: "Your Challenge, Your Way",
      description:
        "Set your own learning goals and decide how long you want to take.",
      icon: <Swords />,
    },
    {
      id: 2,
      title: "Built-in Progress Tracking",
      description:
        "Stay consistent with built-in streaks, analytics, and progress tracking.",
      icon: <ChartColumnIncreasing />,
    },
    {
      id: 3,
      title: "Community-Powered Learning",
      description:
        "Share your journey, get feedback, and engage with other developers.",
      icon: <Users />,
    },
    {
      id: 4,
      title: "Exclusive Beta Access",
      description:
        "Get early access and help shape the future of JourneySkill.",
      icon: <AppWindow />,
    },
  ];

  // how it work section
  const howItWorkContent = [
    {
      id: 1,
      title: "1. Create Your Own Challenge",
      description:
        "Choose what to learn and how many days to commit. Tailor the challenge to your needs.",
    },
    {
      id: 2,
      title: "2. Track Your Progress",
      description:
        "Visualize your progress with built-in analytics and stay on track with streaks.",
    },
    {
      id: 3,
      title: "3. Post & Engage",
      description:
        "Share your journey, celebrate wins, and get feedback from the community.",
    },
  ];
  return (
    <div className="bg-gray-50  flex flex-col justify-center">
      {/* Header Section */}
      <header
        className="text-center py-12 px-6 bg-indigo-600 text-white h-screen  flex 
      flex-col  justify-center "
      >
        <div className="flex  flex-col items-center justify-center max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl ">
            {heroSectionContent.title}
          </h1>
          <p className="mt-4 text-base sm:text-xl max-w-lg">
            {heroSectionContent.description}
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-block bg-indigo-700 px-6 py-3 rounded-lg text-lg 
            font-semibold hover:bg-indigo-800 max-w-fit"
          >
            Join the Beta Now
          </Link>
        </div>
      </header>

      {/* Why Join Section */}
      <section
        className="text-center py-16 px-6  md:h-screen 
       dark:bg-background dark:text-foreground"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground">
          Why Join the JourneySkill Beta?
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-16  ">
          {whyJoinUsContent.map((content) => (
            <div
              className="flex flex-col items-center shadow-sm rounded-md py-8 border border-neutral-200 dark:border-border"
              key={content.id}
            >
              <span className="text-4xl text-indigo-600">{content.icon}</span>
              <h3 className="mt-4 text-xl font-semibold">{content.title} </h3>
              <p className="mt-2 text-gray-600 dark:text-neutral-400 max-w-sm">
                {content.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-indigo-100 dark:bg-black  ">
        <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-foreground">
          How It Works
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
          {howItWorkContent.map((content) => (
            <div className="text-center" key={content.id}>
              <h3 className="text-xl font-semibold text-indigo-600">
                {content.title}
              </h3>
              <p className="mt-4 text-gray-700 dark:text-neutral-400">
                {content.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="signup"
        className="py-16 bg-white text-center h-96 flex flex-col items-center justify-center dark:bg-background
       dark:text-foreground"
      >
        <h2 className="text-3xl font-bold  dark:text-foreground">
          Join the Beta – Start Your Coding Journey Today!
        </h2>
        <p className="mt-4 text-lg dark:text-muted-foreground">
          Be part of the first wave of developers shaping JourneySkill. Don’t
          miss out!
        </p>
        <Link
          href="/sign-up"
          className="mt-6 inline-block bg-indigo-700 px-8 py-3 rounded-lg text-white text-xl font-semibold hover:bg-indigo-800"
        >
          Join Now
        </Link>
      </section>

      {/* Footer Section */}
      <footer
        className="py-3  dark:bg-background border-t dark:border-border text-sm
      text-center dark:text-muted-foreground"
      >
        <p>
          &copy; {new Date().getFullYear()} JourneySkill. All rights reserved.
        </p>
        <div className="mt-2">
          <Link href="/terms-of-services" className="hover:underline">
            Terms of Service
          </Link>
          |{" "}
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
