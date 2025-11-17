import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // Public pages allowed
  if (req.nextUrl.pathname.startsWith("/login")) return NextResponse.next();

  // If no token → redirect to login
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const decoded = jwt.decode(token);

    if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/student") && decoded.role !== "student") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
