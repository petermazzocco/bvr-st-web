import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get("authToken")?.value;

  // Allow membership page to handle Stripe checkout callbacks without authentication
  if (request.nextUrl.pathname === "/membership") {
    const stripeCheckout = request.nextUrl.searchParams.get("stripe_checkout");
    if (stripeCheckout === "success") {
      return NextResponse.next();
    }
  }

  // If no token exists, redirect to login page
  if (!token) {
    // You can redirect to any signin page you want
    const signinUrl = new URL("/signin", request.url);
    // Optional: Add a redirect parameter to send them back after signin
    signinUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Optional: Validate the token structure (similar to your getUserIdFromToken function)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // You can add additional checks here if needed
    if (!payload.userid) {
      const signinUrl = new URL("/signin", request.url);
      return NextResponse.redirect(signinUrl);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    const signinUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signinUrl);
  }

  // If token exists and is valid, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/auctions/:path*", "/account/:path*", "/membership"],
};
