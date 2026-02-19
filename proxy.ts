import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "@/lib/cookie";

const authRoutes = ["/login", "/register", "/forget-password", "/reset-password"];
const adminRoutes = ["/admin"];
const userRoutes = ["/user"];

const resolveRoleHome = (role: string) => {
  return role === "admin" ? "/admin" : "/user/dashboard";
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;
  const role = String(user?.role || "").toLowerCase();

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isLandingRoute = pathname === "/";
  const isPublicRoute = isAuthRoute || isLandingRoute;
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && user) {
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    if (isUserRoute && role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isUserRoute && role !== "user" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(resolveRoleHome(role), request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register",
    "/forget-password",
    "/reset-password",
  ],
};
