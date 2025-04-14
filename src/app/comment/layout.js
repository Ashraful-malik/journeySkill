function stripHtml(html) {
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export async function generateMetadata({ params }) {
  const { id } = await params;
  const url = new URL(
    `/posts/comment/${id}/?type=post`,
    process.env.NEXT_PUBLIC_SITE_URL
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/metadata/post/${id}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const post = await res.json();

    // Safely handle data
    const description = stripHtml(post.data.text || "A post on journeyskill");
    const username = post.data.owner?.username || "a user";
    const title = `Post by @${username}`;

    // Dynamic OG Image (recommended)
    const ogImageUrl = new URL("/api/og", process.env.NEXT_PUBLIC_SITE_URL);
    ogImageUrl.searchParams.set("title", title);
    ogImageUrl.searchParams.set("description", truncateText(description, 100));

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
      title,
      description: truncateText(description, 160),
      alternates: {
        canonical: url.toString(),
      },
      twitter: {
        card: "summary_large_image", // Better engagement than 'summary'
        title,
        description: truncateText(description, 200),
        images: [ogImageUrl.toString()],
        creator: "@Ashraful__malik",
      },
      openGraph: {
        type: "article",
        title,
        description: truncateText(description, 200),
        url: url.toString(),
        images: [
          {
            url: ogImageUrl.toString(),
            width: 1200,
            height: 630,
            alt: `Post by ${username}`,
          },
        ],
        publishedTime: post.data.createdAt || new Date().toISOString(),
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

// Utility functions
function truncateText(str, length) {
  if (!str) return "";
  return str.length > length ? str.substring(0, length - 3) + "..." : str;
}

function getFallbackMetadata(url) {
  const fallbackImage = new URL(
    "/twitterCard/landing-page.png",
    process.env.NEXT_PUBLIC_SITE_URL
  );
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
    title: "Post | journeyskill",
    description: "View this post on journeyskill",
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
      title: "Post | journeyskill",
      description: "View this post on journeyskill",
      url: url.toString(),
      images: [
        {
          url: fallbackImage.toString(),
          width: 1200,
          height: 630,
          alt: "JourneySkill Post",
        },
      ],
    },
  };
}
