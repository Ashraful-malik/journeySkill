"use client";
import { SignUp, useAuth } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded } = useAuth();
  return (
    <>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center py-20 ">
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">Welcome to JourneySkill</h1>
          <p className="text-lg">
            Master new skills through personalized challenges. Build in public,
            track your progress, and connect with a community of learners like
            you.
          </p>
          <p className="text-lg">Sign up to get started</p>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0  flex items-center justify-center">
          {isLoaded ? (
            <SignUp
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-green-800 text-white px-6 py-3 rounded-full hover:bg-green-600 shadow-none ",
                  card: "bg-black shadow-none	",
                },
              }}
            />
          ) : (
            <div className="w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700">
              <div className="h-2.5 bg-green-600 dark:bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
