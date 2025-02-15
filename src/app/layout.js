import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import QueryProvider from "../lib/QueryProvider";
import { UserProvider } from "@/context/userContent";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { auth } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/api/user";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
export const metadata = {
  title: "JourneySkill",
  description:
    "Master new skills through personalized challenges. Build in public, track your progress, and connect with a community of learners like you.",
  twitter: {
    card: "summary_large_image",
    title: "JourneySkill",
    description:
      "Master new skills through personalized challenges. Build in public, track your progress, and connect with a community of learners like you.",
    creator: "@Ashraful__malik",
    siteName: "JourneySkill",
    images: [
      {
        url: "https://journeyskill.vercel.app/jorneyskill.png",
        width: 800,
        height: 600,
        alt: "journeyskill image",
      },
    ],
  },
  openGraph: {
    title: "JourneySkill",
    description:
      "Master new skills through personalized challenges. Build in public, track your progress, and connect with a community of learners like you.",
    siteName: "JourneySkill",
    locale: "en_US",
    type: "website",
    url: "https://journeyskill.vercel.app",
    images: [
      {
        url: "https://journeyskill.vercel.app/jorneyskill.png",
        width: 800,
        height: 600,
        alt: "journeyskill image",
      },
    ],
  },
};

export default async function RootLayout({ children }) {
  const queryClient = new QueryClient();
  // clerk mongodb id from the session
  const session = await auth();
  const userId = await session?.sessionClaims?.user_Id;
  // if (userId) {
  //   await queryClient.prefetchQuery({
  //     queryKey: ["user", userId],
  //     queryFn: () => fetchUser(userId),
  //     staleTime: 60 * 60 * 1000, //1 hour
  //   });
  // }
  const dehydratedState = dehydrate(queryClient);
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <UserProvider>
        <html lang="en" className={`${inter.className}`}>
          <body className="antialiased">
            {/* <ClerkLoading>
              loading
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="w-16 h-16 border-b-2 border-white rounded-full animate-spin"></div>
              </div>
            </ClerkLoading> */}
            {/* <ClerkLoaded> */}
            <NavbarWrapper />
            <ThemeProvider attribute="class" defaultTheme="dark">
              <QueryProvider dehydratedState={dehydratedState}>
                {children}
                <Toaster />
              </QueryProvider>
            </ThemeProvider>
            {/* </ClerkLoaded> */}
          </body>
        </html>
      </UserProvider>
    </ClerkProvider>
  );
}
