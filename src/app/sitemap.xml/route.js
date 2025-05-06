import dbConnect from "@/lib/dbConnect";
import { Challenge } from "@/models/challenge.model";
import User from "@/models/user.model";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

// get user
export async function GET() {
  await dbConnect();
  const users = await User.find({}, "username");
  const challenges = await Challenge.find({ isPublic: true }, "_id");

  const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    ...users.map((user) => ({
      url: `/profile/${user.username}`,
      changefreq: "daily",
      priority: 0.8,
    })),
    ...challenges.map((challenge) => ({
      url: `/challenges/${challenge._id.toString()}`,
      changefreq: "weekly",
      priority: 0.8,
    })),
    { url: "/terms", changefreq: "daily", priority: 0.8 },
    { url: "/privacy-policy", changefreq: "daily", priority: 0.8 },
  ];
  const stream = new SitemapStream({
    hostname: process.env.NEXT_PUBLIC_API_BASE_URL,
  });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(
    (data) => data.toString()
  );

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
