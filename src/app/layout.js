import Navbar from "@/components/ui/Navbar";
import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

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

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="dark">
        <body className=" antialiased">
          <ClerkLoading>
            {/* loading */}
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="w-16 h-16 border-b-2 border-white rounded-full animate-spin"></div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <Navbar />
            {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
