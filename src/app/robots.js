export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sitemap.xml`,
  };
}
