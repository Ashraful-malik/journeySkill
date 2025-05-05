import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/terms",
  "/privacy-policy",
]);

// Define public API routes
const isPublicApiRoute = createRouteMatcher([
  "/api/webhook/register",
  "/api/metadata(.*)",
  "/api/metadata/challenge(.*)",
  "/api/metadata/post(.*)",
  "/api/og(.*)",
]);

export default clerkMiddleware(async (authFn, req) => {
  try {
    const auth = await authFn();
    const { userId } = auth; // Clerk provides `userId` if authenticated

    const currentUrl = new URL(req.url);
    // const isApiRequest = currentUrl.pathname.startsWith("/api(.*)");

    // 1. **Allow public API routes to bypass all authentication logic**
    if (isPublicApiRoute(req)) {
      return NextResponse.next(); // Let public API routes proceed
    }
    // 2️⃣ **Restrict access to ALL OTHER API routes for unauthenticated users**
    if (currentUrl.pathname.startsWith("/api") && !userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    // 2. **Unauthenticated user logic**
    if (!userId) {
      if (!isPublicRoute(req)) {
        // Redirect unauthenticated users trying to access private routes
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      return NextResponse.next(); // Allow unauthenticated users to access public routes
    }

    // 4️⃣ **Redirect authenticated users away from `/`, `/sign-in`, `/sign-up`**
    if (userId && isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    // 4. **Default case**
    return NextResponse.next();
  } catch (error) {
    return new NextResponse("Something went wrong. Please try again later.", {
      status: 500,
    });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
