import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check Maintenance Mode (skip for admin, api and static files)
  if (!pathname.startsWith("/admin") && 
      !pathname.startsWith("/api") && 
      !pathname.startsWith("/_next") &&
      pathname !== "/manutenzione" &&
      !pathname.includes(".")) {
    
    try {
      // Fetch maintenance status from our internal API
      const baseUrl = request.nextUrl.origin;
      const res = await fetch(`${baseUrl}/api/maintenance`, { next: { revalidate: 0 } });
      const { enabled, allowedIps } = await res.json();

      if (enabled) {
        const clientIp = request.ip || request.headers.get("x-forwarded-for")?.split(",")[0] || "";
        const isAllowed = allowedIps.includes(clientIp) || clientIp === "127.0.0.1";

        if (!isAllowed) {
          return NextResponse.redirect(new URL("/manutenzione", request.url));
        }
      }
    } catch (e) {
      console.error("Maintenance check failed", e);
    }
  }

  // 2. Auth Protection for /admin
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isOnAdmin = pathname.startsWith("/admin");

  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/mio-account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
