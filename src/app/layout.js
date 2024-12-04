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
      <body className={` antialiased`}>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
