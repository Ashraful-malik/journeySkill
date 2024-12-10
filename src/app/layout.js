import Navbar from "@/components/ui/Navbar";
import "./globals.css";

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
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css"
        />
      </head>
      <body className="bg-gray-300 text-gray-950 dark:bg-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
