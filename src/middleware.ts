import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // 1. Check Maintenance Mode (skip for admin, api, login and static files)
  if (!pathname.startsWith("/admin") && 
      !pathname.startsWith("/api") && 
      !pathname.startsWith("/_next") &&
      pathname !== "/manutenzione" &&
      pathname !== "/mio-account" &&
      !pathname.includes(".")) {
    
    try {
      // Fetch maintenance status from our internal API
      const baseUrl = request.nextUrl.origin;
      const res = await fetch(`${baseUrl}/api/maintenance`, { next: { revalidate: 0 } });
      const { enabled } = await res.json();

      // IF maintenance is ON and user is NOT logged in -> redirect to maintenance
      if (enabled && !isLoggedIn) {
        return NextResponse.redirect(new URL("/manutenzione", request.url));
      }
    } catch (e) {
      console.error("Maintenance check failed", e);
    }
  }

  // 2. Auth Protection for /admin
  const isOnAdmin = pathname.startsWith("/admin");
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/mio-account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
