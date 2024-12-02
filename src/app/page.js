"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  // const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  console.log(user, isLoaded, isSignedIn);

  const content = {
    title: "Learn, Grow, and Inspire—Together.",
    description:
      "Master new skills through personalized challenges. Build in public, track your progress, and connect with a community of learners like you.",
  };
  return (
    <main className="flex min-h-screen item-center justify-center ">
      <section className="flex flex-col  justify-center items-center w-full md:w-4/5 p-6 md:p-12">
        <h1 className="text-3xl font-bold md:text-5xl text-gray-200">
          {content.title}
        </h1>
        <p className="md:text-xl mt-6 max-w-screen-sm text-gray-400 text-center">
          {content.description}
        </p>
        <Link
          href="https://forms.gle/xvAeJYy7geVpQKQ69"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-800 text-white px-6 py-3 rounded-full hover:bg-green-600 mt-6"
        >
          Join the Waitlist
        </Link>
        <div className="mt-8 flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-400">Follow my building journey</p>

          <Link
            href="https://twitter.com/Ashraful__malik"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-twitter-x"
              viewBox="0 0 16 16"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
