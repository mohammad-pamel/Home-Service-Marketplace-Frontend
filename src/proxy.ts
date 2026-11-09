
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const roleRoutes: Record<string, string> = {
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
  CUSTOMER: "/customer",
  PROVIDER: "/provider",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/provider");

  // All authentication-related pages
  const authRoutes = [
    "/login",
    "/registration",
    "/forgot-password",
    "/reset-password",
  ];

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Allow public pages without authentication
  if (!isDashboardRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from dashboard
  if (!accessToken) {
    if (isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  try {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
    }

    const response = await fetch(
      `${API_BASE_URL.replace(/\/+$/, "")}/auth/me`,
      {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      },
    );

    // Invalid or expired token
    if (!response.ok) {
      if (isDashboardRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);

        const redirectResponse = NextResponse.redirect(loginUrl);

        redirectResponse.cookies.delete("accessToken");
        redirectResponse.cookies.delete("refreshToken");

        return redirectResponse;
      }

      // Allow logged-out users to access auth pages
      return NextResponse.next();
    }

    const result = await response.json();
    const user = result?.data;
    const role = user?.role;

    const dashboardPath = roleRoutes[role];

    if (!dashboardPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Authenticated users cannot access login,
    // registration, forgot-password or reset-password
    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(dashboardPath, request.url),
      );
    }

    // Role-based dashboard access
    const isAdminRoute = pathname.startsWith("/admin");
    const isCustomerRoute = pathname.startsWith("/customer");
    const isProviderRoute = pathname.startsWith("/provider");

    const isAuthorized =
      (isAdminRoute && (role === "ADMIN" || role === "SUPER_ADMIN")) ||
      (isCustomerRoute && role === "CUSTOMER") ||
      (isProviderRoute && role === "PROVIDER");

    if (!isAuthorized) {
      return NextResponse.redirect(
        new URL(dashboardPath, request.url),
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    if (isDashboardRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
    "/provider/:path*",
    "/login",
    "/registration/:path*",
    "/registration",
    "/forgot-password",
    "/reset-password",
  ],
};
