import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const clerkEnabled = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Marketing-Seiten, die in der nativen App keinen Sinn ergeben — die App
// (User-Agent "hey247App") startet direkt in Login/Dashboard.
// /hilfe und /legal/* bleiben in der App erreichbar.
const isMarketingRoute = createRouteMatcher([
  "/",
  "/en",
  "/pricing",
  "/pilot",
  "/en/pricing",
  "/en/pilot",
]);

function nativeAppRedirect(req: NextRequest): NextResponse | null {
  const ua = req.headers.get("user-agent") ?? "";
  if (ua.includes("hey247App") && isMarketingRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return null;
}

// Without Clerk keys the app runs in demo mode and every route is public.
export default clerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      const redirect = nativeAppRedirect(req);
      if (redirect) return redirect;
      if (isProtectedRoute(req)) await auth.protect();
    })
  : function middleware(req: NextRequest) {
      return nativeAppRedirect(req) ?? NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
