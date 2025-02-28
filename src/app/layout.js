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
import Script from "next/script";
import HotjarTracker from "@/components/HotjarTracker";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["sans-serif"],
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

  const dehydratedState = dehydrate(queryClient);
  return (
    <ClerkProvider appearance={{ baseTheme: "light" }}>
      <UserProvider>
        <html lang="en" className={`${inter.className}`}>
          <head>
            {/* Hotjar Tracking Script */}
            <Script
              id="hotjar-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID || 0},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `,
              }}
            />
          </head>
          <body className="antialiased">
            <HotjarTracker /> {/* Track route changes */}
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            {/* <ClerkLoading>
              loading
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="w-16 h-16 border-b-2 border-white rounded-full animate-spin"></div>
              </div>
            </ClerkLoading> */}
            {/* <ClerkLoaded> */}
            <ThemeProvider attribute="class" defaultTheme="dark">
              <NavbarWrapper />
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
