import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-center py-20 ">
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold">Welcome to JourneySkill</h1>
        <p className="text-lg">
          Master new skills through personalized challenges. Build in public,
          track your progress, and connect with a community of learners like
          you.
        </p>
        <p className="text-lg">Sign in to get started</p>
      </div>
      <div className="md:w-1/2 mt-10 md:mt-0  flex items-center justify-center">
        <SignIn afterSignOutUrl="/" />
      </div>
    </div>
  );
}
