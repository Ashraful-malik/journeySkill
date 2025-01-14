import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

// Define public API routes
const isPublicApiRoute = createRouteMatcher([
  "/api/webhook/register",
  "/api(.*)",
]);

export default clerkMiddleware(async (authFn, req) => {
  const auth = await authFn();
  const { userId } = auth; // Clerk provides `userId` if authenticated

  const currentUrl = new URL(req.url);
  const isApiRequest = currentUrl.pathname.startsWith("/api(.*)");

  // 1. **Allow public API routes to bypass all authentication logic**
  if (isPublicApiRoute(req)) {
    return NextResponse.next(); // Let public API routes proceed
  }

  // 2. **Unauthenticated user logic**
  if (!userId) {
    if (!isPublicRoute(req)) {
      // Redirect unauthenticated users trying to access private routes
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next(); // Allow unauthenticated users to access public routes
  }

  // 3. **Authenticated user logic**
  if (userId) {
    if (isPublicRoute(req) && currentUrl.pathname !== "/") {
      // Redirect signed-in users away from public routes like `/sign-in` or `/sign-up`
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (isApiRequest) {
      // Allow authenticated users to make API requests
      return NextResponse.next();
    }
  }

  // 4. **Default case**
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
