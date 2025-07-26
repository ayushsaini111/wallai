import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  // Define protected routes and their redirect behaviors
  const protectedRoutes = {
    "/upload": "/auth/login",
    "/profile": "/auth/login",
    "/favorites": "/auth/login",
    "/settings": "/auth/login",
    "/wallpapers/edit": "/auth/login",
    "/wallpapers/delete": "/auth/login"
  };

  // Define auth routes that should redirect to home if already logged in
  const authRoutes = ["/auth/login", "/auth/signup"];
  
  // Check if user is accessing an auth route while logged in
  if (token && authRoutes.some(route => currentPath.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if the current path needs protection
  for (const [protectedPath, redirectPath] of Object.entries(protectedRoutes)) {
    if (currentPath.startsWith(protectedPath) && !token) {
      // Store the attempted URL to redirect back after login
      const redirectUrl = new URL(redirectPath, request.url);
      redirectUrl.searchParams.set("callbackUrl", currentPath);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Special case for logout route - must have token
  if (currentPath === "/logout" && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/profile/:path*",
    "/favorites/:path*",
    "/settings/:path*",
    "/wallpapers/edit/:path*",
    "/wallpapers/delete/:path*",
    "/auth/:path*",
    "/logout"
  ],
};
