"use client";
import HeroVideoPlayer from "@/components/HeroVideoPlayer";
import { AppWindow, ChartColumnIncreasing, Swords, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroSectionContent = {
    title: "The Developer’s Challenge Platform – Your Goals, Your Journey",
    description:
      "Create, track, and complete coding challenges. Stay accountable and grow your skills, one streak at a time",
  };

  return (
    <div className="bg-neutral-100  dark:bg-black flex flex-col justify-center ">
      {/* Header Section */}
      <header className="text-center  bg-indigo-600 text-white flex  flex-col justify-center pb-10 ">
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center md:py-32 pt-32 pb-9 ">
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
        <div className="md:w-10/12 w-11/12 mx-auto bg-white/15 rounded-xl  p-1">
          <HeroVideoPlayer />
        </div>
      </header>
      {/* Why Join Section */}
      <section
        className="py-24 
       dark:bg-background dark:text-foreground"
        id="features"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground text-center">
          Why Join the JourneySkill Beta?
        </h2>
        <FeatureCard
          title="Build Custom Challenges"
          description="Take control of your learning journey by creating challenges tailored to your goals. Whether you're learning a new language or mastering a framework, you define the path."
          image="/assets/images/journeyskill-challenge.png"
          imageClassName="mt-16"
        />
        <FeatureCard
          title="A streak tracker or progress bar"
          description="Consistency is key to mastering coding. JourneySkill’s streak tracker keeps you motivated by visually showing your progress, rewarding every milestone."
          image="/assets/images/journeyskill-streak.png"
        />
        <FeatureCard
          title="Analytics That Matter"
          description="Get detailed insights into your coding journey—track completed tasks, view progress over time,"
          image="/assets/images/journeyskill-analytics.png"
          imageClassName=""
        />
        <FeatureCard
          title="Community-Driven Accountability"
          description="Stay on track with built-in social features like likes and comments. Connect with like-minded developers, get feedback on your progress, and stay motivated together."
          image="/assets/images/journeyskill-community.png"
        />
      </section>
      {/* How It Works Section */}
      <section className="py-24  ">
        <h2 className="text-3xl font-bold text-center text-primary">
          How JourneySkill Works
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 mt-32 ">
          <div
            className="border-b md:border-r  hover:bg-neutral-200 dark:hover:bg-secondary transform hover:scale-105 
            transition-transform p-4
          "
          >
            <HowDoesItWork
              title="1. Create Your Challenge"
              description="Set up your own coding challenge with customized tasks and durations."
            />
          </div>
          <div className="border-b  hover:bg-neutral-200 dark:hover:bg-secondary  transform hover:scale-105 transition-transform p-4 ">
            <HowDoesItWork
              title="2. Track Your Progress"
              description="Monitor your streaks, completion rate, and analytics on the dashboard."
            />
          </div>
          <div
            className="md:border-r  hover:bg-neutral-200 dark:hover:bg-secondary  transform hover:scale-105 transition-transform p-4
          "
          >
            <HowDoesItWork
              title="3. Engage with the Community"
              description="Interact with fellow developers using likes and comments on challenge posts."
            />
          </div>
          <div
            className="hover:bg-neutral-200 dark:hover:bg-secondary  transform hover:scale-105 transition-transform p-4
          "
          >
            <HowDoesItWork
              title="4. Stay Consistent"
              description="Use the insights and progress tracking to keep yourself on track and motivated."
            />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        id="signup"
        className="py-16 bg-indigo-700 text-center h-[32rem] flex flex-col items-center justify-center
       dark:text-foreground"
      >
        <h2
          className="scroll-m-20  pb-2 text-4xl md:text-5xl font-semibold tracking-tight first:mt-0 max-w-2xl 
        text-neutral-50 "
        >
          Master coding habits that stick. Your journey starts with one
          challenge.
        </h2>

        <Link
          href="/sign-up"
          className="mt-6 inline-block border border-white px-8 py-3 rounded-lg
           text-white text-xl  hover:bg-indigo-800"
        >
          Join Now
        </Link>
      </section>
      {/* Footer Section */}
      <footer
        className="py-8 bg-indigo-700  dark:border-border text-sm
      text-center text-white "
      >
        <p>
          &copy; {new Date().getFullYear()} JourneySkill. All rights reserved.
        </p>
        <div className="mt-2 flex items-center gap-2 justify-center ">
          <Link href="/terms" className="hover:underline ">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard(params) {
  return (
    <div
      className={`max-w-6xl bg-neutral-100 dark:bg-black mx-auto border h-[32rem] border-border/50
         overflow-hidden mt-24 rounded-lg hover:shadow-lg hover:cursor-pointer`}
    >
      <div className="flex md:flex-row h-full rounded-lg  flex-col">
        <div className=" flex-1 h-full rounded-lg flex flex-col justify-center pl-8">
          {/* <span className="text-4xl text-indigo-600">{params.icon}</span> */}
          <h3 className="mt-4 text-2xl font-medium">{params.title}</h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400 max-w-sm">
            {params.description}
          </p>
        </div>
        <div
          className="flex-1 flex items-center justify-center h-full  py-2 -mr-4 
         overflow-hidden"
        >
          <Image
            src={params.image}
            alt="feature image"
            className={`w-3/4 md:w-auto ${params.imageClassName}`}
            width={800}
            height={800}
          />
        </div>
      </div>
    </div>
  );
}
function HowDoesItWork(params) {
  return (
    <div className={` h-48  ${params.className}`}>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-secondary-foreground dark:text-neutral-100">
        {params.title}
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-sm text-gray-600 dark:text-neutral-400">
        {params.description}
      </p>
    </div>
  );
}
