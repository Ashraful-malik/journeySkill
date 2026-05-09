import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-light.png" alt="logo" width={24} height={24} />
          <span className="text-xl font-semibold">JourneySkill</span>
        </Link>

        {/* Content */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Pick up where you left off.
          </h1>
          <p className="mt-4 text-white/80">
            Continue your coding journey, track progress, and unlock new
            challenges.
          </p>
        </div>

        {/* Footer hint */}
        <p className="text-sm text-white/60">
          Built for developers who ship 🚀
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 dark:bg-background px-6">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to continue your journey
          </p>

          <SignIn fallbackRedirectUrl="/home" />

          <p className="text-xs text-center text-muted-foreground mt-6">
            We respect your privacy. No spam.
          </p>
        </div>
      </div>
    </div>
  );
}
