import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken } from "./lib/utils/tokenRefresh";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Auth pages that don't require login
  const authPaths = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthPage = authPaths.includes(pathname);
  const isLoggedIn = !!accessToken || !!refreshToken;

  // Not logged in → redirect to login, except for auth pages
  if (!isLoggedIn && !isAuthPage) {
    const redirectTo = pathname + request.nextUrl.search;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in and on root → redirect to /project
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/project", request.url));
  }

  // Logged in and on auth pages → redirect to /project
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/project", request.url));
  }

  // If accessToken is missing/expired but refreshToken exists, refresh it
  if (!accessToken && refreshToken && !isAuthPage) {
    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return NextResponse.redirect(request.url);
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
