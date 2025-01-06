"use client";
import { SignUp, useAuth, useClerk } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded } = useAuth(); // Checks if Clerk is fully loaded

  const signInPageContent = [
    {
      heading: "Welcome to JourneySkill",
      paragraph:
        "Master new skills through personalized challenges. Build in public, track your progress, and connect with a community of learners like you.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row ">
      {/* Left Section */}
      <div
        className={`md:w-1/2 flex flex-col justify-center items-center px-6 border-r pb-12
                bg-gradient-to-tr from-green-500/40 to-green-500/60
         `}
      >
        {signInPageContent.map((item, idx) => (
          <div key={idx} className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl max-w-4xl">
              {item.heading}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-xl">
              {item.paragraph}
            </p>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div
        className={`md:w-1/2 flex flex-col justify-center items-center px-6 p-4 `}
      >
        <SignUp />
      </div>
    </div>
  );
}
