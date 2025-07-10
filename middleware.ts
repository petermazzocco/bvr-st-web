import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

// target specific paths for the Middleware to run on.
export const config = {
  matcher: ["/auctions/:path*"],
};
