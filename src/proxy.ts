import { NextRequest, NextResponse } from "next/server";
import { isProtectedPath } from "@/lib/auth/paths";
import { hasSessionCookie } from "@/lib/auth/session-cookie";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request.cookies.getAll())) {
    const login = new URL("/entrar", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
