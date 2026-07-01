import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

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
      const port = process.env.PORT || 3022;
      const res = await fetch(`http://127.0.0.1:${port}/api/maintenance`, { 
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(2000) // Don't hang the request
      });
      
      if (res.ok) {
        const { enabled } = await res.json();
        if (enabled && !isLoggedIn) {
          return NextResponse.redirect(new URL("/manutenzione", request.url));
        }
      }
    } catch (e) {
      // Quietly ignore maintenance fetch errors in dev or if server is busy
      // console.error("Maintenance check skipped due to fetch error");
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
