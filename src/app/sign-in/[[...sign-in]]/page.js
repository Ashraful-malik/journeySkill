import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const signInPageContent = [
    {
      heading: "🔑 Welcome Back, Developer",
      paragraph:
        "Your challenges, progress, and coding journey await. Keep building, keep growing.",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row md:h-screen">
      {/* only Visible in mobile */}
      <div className="flex w-full items-center justify-center py-6 md:hidden bg-indigo-600">
        <Link href="/" className="top-4 left-4 flex items-center ">
          <Image src="/logo.png" alt="logo" width={20} height={20} />
          <p className="text-2xl font-bold text-white pl-2">JourneySkill</p>
        </Link>
      </div>
      {/* Left Section for desktop*/}
      <div className="md:w-1/2 hidden md:flex  flex-col justify-center items-center px-6 border-r bg-indigo-600 relative ">
        {/* logo and name its position absolute*/}
        <Link href="/" className="absolute top-4 left-4 flex items-center ">
          <Image src="/logo.png" alt="logo" width={20} height={20} />
          <p className="text-2xl font-bold text-white pl-2">JourneySkill</p>
        </Link>
        {signInPageContent.map((item, idx) => (
          <div
            key={idx}
            className="text-center text-white flex items-center flex-col"
          >
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl max-w-4xl">
              {item.heading}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-md">
              {item.paragraph}
            </p>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="md:w-1/2  flex flex-col justify-center items-center px-6 dark:bg-background ">
        <SignIn fallbackRedirectUrl="/home" />
      </div>
    </div>
  );
}
