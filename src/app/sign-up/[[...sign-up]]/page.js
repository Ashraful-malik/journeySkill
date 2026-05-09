"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden">
      {/* LEFT - Gradient Section */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-light.png" alt="logo" width={22} height={22} />
          <span className="text-lg font-semibold">JourneySkill</span>
        </Link>

        {/* Content */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Start your coding journey today 🚀
          </h1>
          <p className="mt-4 text-white/80">
            Create challenges, track progress, and level up—on your terms.
          </p>
        </div>

        {/* Footer */}
        <p className="text-sm text-white/60">Build consistency. Ship faster.</p>
      </div>

      {/* RIGHT - Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-4 py-10 bg-gray-50 dark:bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="logo" width={22} height={22} />
              <span className="text-lg font-semibold">JourneySkill</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-center mb-2">
              Create your account
            </h2>
            <p className="text-sm text-center text-muted-foreground mb-6">
              It takes less than a minute
            </p>

            {isLoading ? (
              <div className="flex flex-col items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
                <p className="mt-3 text-sm text-gray-500">
                  Preparing your experience...
                </p>
              </div>
            ) : (
              <SignUp fallbackRedirectUrl="/home" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
