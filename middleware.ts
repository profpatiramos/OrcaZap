import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "orcazap_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");

  if (!isDashboard) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};