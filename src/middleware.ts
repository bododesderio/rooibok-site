import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require ADMIN role (not accessible to EDITOR)
const ADMIN_ONLY_ROUTES = [
  "/admin/services",
  "/admin/careers",
  "/admin/inquiries",
  "/admin/team",
  "/admin/content",
  "/admin/popups",
  "/admin/legal",
  "/admin/media",
  "/admin/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role for admin-only routes
    const isAdminOnly = ADMIN_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminOnly && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
