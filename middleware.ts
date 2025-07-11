import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from cookies or authorization header
  const token = request.cookies.get("authToken")?.value;
}

export const config = {
  matcher: ["/auctions/:path*", "/account/:path*"],
};
