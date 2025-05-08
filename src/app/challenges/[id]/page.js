import IndividualChallengeWrapper from "@/components/challenge/individualChallenge/IndividualChallengeWrapper";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

// Utility functions
export const dynamic = "force-dynamic";

function truncateText(str, length) {
  if (!str) return "";
  return str.length > length ? str.substring(0, length - 3) + "..." : str;
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  const url = new URL(`challenges/${id}`, process.env.NEXT_PUBLIC_SITE_URL);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/metadata/challenge/${id}`
    );
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const challenge = await res.json();

    // Safely handle data
    const title = challenge.data.challengeName || "A challenge on journeyskill";
    const description =
      challenge.data.description || "A challenge on journeyskill";
    const username = challenge.data.challengeOwner?.username || "a user";

    const cardImage =
      challenge?.data.banner?.imageUrl ||
      `${process.env.NEXT_PUBLIC_SITE_URL}/twitterCard/journeyskill-card.png`;

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
      title,
      description,
      alternates: {
        canonical: url.toString(),
      },
      twitter: {
        card: "summary_large_image", // Better engagement than 'summary'
        title: title,
        description: truncateText(description, 200),
        // images: [cardImage],
        images: [
          {
            url: cardImage,
            width: 1200,
            height: 628,
            alt: "Challenge image",
          },
        ],

        creator: "@Ashraful__malik",
      },
      openGraph: {
        type: "article",
        title: title,
        description: truncateText(description, 200),
        url: url.toString(),
        images: [
          {
            url: cardImage,
            width: 1200,
            height: 630,
            alt: `Post by ${username}`,
          },
        ],
        publishedTime: challenge.data.createdAt || new Date().toISOString(),
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return getFallbackMetadata(url);
  }
}
function getFallbackMetadata(url) {
  const fallbackImage = new URL(
    "/twitterCard/journeyskill-card.png",
    process.env.NEXT_PUBLIC_SITE_URL
  );
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
    title: "Challenge | journeyskill",
    description: "View this Challenge on journeyskill",
    alternates: {
      canonical: url.toString(),
    },
    twitter: {
      card: "summary_large_image",
      title: "Post | journeyskill",
      description: "Explore this content on journeyskill",
      images: [fallbackImage.toString()],
    },
    openGraph: {
      title: "Challenge | journeyskill",
      description: "View this Challenge on journeyskill",
      url: url.toString(),
      images: [
        {
          url: fallbackImage.toString(),
          width: 1200,
          height: 630,
          alt: "JourneySkill challenge",
        },
      ],
    },
  };
}
export default function Page() {
  return (
    <>
      <SignedIn>
        <IndividualChallengeWrapper />;
      </SignedIn>
      <SignedOut>
        <div className="p-4 text-center">
          <h3>Please sign in to view this challenge</h3>
          <RedirectToSignIn redirectUrl={"/sign-in"} />
        </div>
      </SignedOut>
    </>
  );
}
