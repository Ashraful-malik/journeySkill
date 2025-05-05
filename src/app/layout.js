import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
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
import ClerkLoadingLoader from "@/components/loader/ClerkLoadingLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["sans-serif"],
});
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "JourneySkill - Build Your Coding Habit",
  description:
    "Join JourneySkill to create custom coding challenges and track your progress.",
  twitter: {
    card: "summary_large_image",
    title: "JourneySkill - Build Your Coding Habit",
    description:
      "Join JourneySkill to create custom coding challenges and track your progress.",
    creator: "@Ashraful__malik",
    siteName: "JourneySkill",
    images: [
      {
        url: "/twitterCard/landing-page.png",
        width: 800,
        height: 600,
        alt: "journeyskill image",
      },
    ],
  },
  openGraph: {
    title: "JourneySkill - Build Your Coding Habit",
    description:
      "Join JourneySkill to create custom coding challenges and track your progress.",
    siteName: "JourneySkill",
    locale: "en_US",
    type: "website",
    url: "https://journeyskill.online",
    images: ["/twitterCard/landing-page.png"],
  },
};

export default async function RootLayout({ children }) {
  const queryClient = new QueryClient();

  const dehydratedState = dehydrate(queryClient);
  return (
    <>
      <ClerkProvider appearance={{ baseTheme: "light" }}>
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
                  h._hjSettings={hjid:${
                    process.env.NEXT_PUBLIC_HOTJAR_ID || 0
                  },hjsv:6};
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
            <ClerkLoading>
              <ClerkLoadingLoader />
            </ClerkLoading>
            <ClerkLoaded>
              <UserProvider>
                <ThemeProvider attribute="class" defaultTheme="system">
                  <NavbarWrapper />
                  <QueryProvider dehydratedState={dehydratedState}>
                    {children}
                    <Toaster />
                  </QueryProvider>
                </ThemeProvider>
              </UserProvider>
            </ClerkLoaded>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
