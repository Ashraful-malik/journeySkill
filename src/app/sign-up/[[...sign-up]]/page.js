"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Simulate Clerk loading
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader when Clerk form is loaded
    }, 300); // Adjust timing if needed

    return () => clearTimeout(timer);
  }, []);
  const signInPageContent = [
    {
      heading: "🚀 Start Your Coding Journey Today",
      paragraph:
        "  Join JourneySkill and create your own coding challenges. Track progress, stay accountable, and level up your skills—on your own terms",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {/* only Visible in mobile */}
      <div className="flex w-full items-center justify-center py-6 md:hidden bg-indigo-600">
        <Link href="/" className="top-4 left-4 flex items-center ">
          <Image src="/logo.png" alt="logo" width={20} height={20} />
          <p className="text-2xl font-bold text-white pl-2">JourneySkill</p>
        </Link>
      </div>
      {/* Left Section for desctop*/}
      <div
        className="md:w-1/2 hidden md:flex flex-col justify-center 
          items-center px-6 border-r bg-indigo-600 relative h-screen "
      >
        {/* logo and name its position absolute*/}
        <Link href="/" className="absolute top-4 left-4 flex items-center ">
          <Image src="/logo.png" alt="logo" width={20} height={20} />
          <p className="text-2xl font-bold text-white pl-2">JourneySkill</p>
        </Link>
        {signInPageContent.map((item, idx) => (
          <div
            key={idx}
            className="text-center text-white  flex flex-col items-center justify-center"
          >
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl max-w-4xl">
              {item.heading}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-lg text-center">
              {item.paragraph}
            </p>
          </div>
        ))}
      </div>
      {/* Right Section */}
      <div className="md:w-1/2 flex flex-col justify-center items-center px-6 mt-1 bg-white dark:bg-background">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <SignUp fallbackRedirectUrl="/home" />
        )}
      </div>
    </div>
  );
}
