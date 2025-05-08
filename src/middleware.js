import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/terms",
  "/privacy-policy",
  // /^\/challenges\/[^\/]+$/, // Public challenge pages
  /^\/comment\/[^\/]+$/, // Public comment pages (ID only)
  "/challenges(.*)",
  "/home",
]);

// Define public API routes
const isPublicApiRoute = createRouteMatcher([
  "/api/webhook/register",
  "/api/metadata(.*)",
  "/api/og(.*)",
  "/api/challenge/all(.*)",
  "/api/posts/feed(.*)",
]);

export default clerkMiddleware(async (authFn, req) => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // 1. Allow public API routes to bypass all authentication logic
    if (isPublicApiRoute(req)) {
      return NextResponse.next();
    }

    const auth = await authFn();
    const { userId } = auth;

    // // 2. Special handling for challenge routes
    // if (pathname.startsWith("/challenges")) {
    //   if (pathname.match(/^\/challenges\/[^\/]+$/)) {
    //     return NextResponse.next(); // Public access
    //   }
    //   if (!userId) return redirectToSignIn(req);
    // }

    // 3. Special handling for comment routes
    if (pathname.startsWith("/comment")) {
      // Public if it's a basic comment view
      if (
        pathname.match(/^\/comment\/[^\/]+$/) &&
        !pathname.includes("/edit") &&
        !pathname.includes("/delete")
      ) {
        return NextResponse.next();
      }
      // Private for comment actions
      if (!userId) return redirectToSignIn(req);
    }

    // 4. Restrict other API routes
    if (pathname.startsWith("/api") && !userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // 5. Handle general public/private routes
    if (!userId && !isPublicRoute(req)) {
      return redirectToSignIn(req);
    }

    // 6. Redirect authenticated users from auth pages
    if (userId && isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return new NextResponse("Something went wrong. Please try again later.", {
      status: 500,
    });
  }
});

// Helper function
function redirectToSignIn(req) {
  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("redirect_url", req.url);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
