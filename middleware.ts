import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isOTPExpired } from "./server/user/actions";

// Define the routes that require authentication
const PROTECTED_ROUTES = ["/account"];
const PUBLIC_ROUTES = ["/signin", "/signup"];

// Helper function to get user ID from JWT token
function getUserIdFromToken(token: string): string | null {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userid || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Get the authToken from cookies
  const authToken = request.cookies.get("authToken")?.value;

  // Check if current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Handle protected routes
  if (isProtectedRoute) {
    if (!authToken) {
      // No auth token, redirect to signin
      const signinUrl = new URL("/signin", request.url);
      return NextResponse.redirect(signinUrl);
    }

    // User has auth token, allow access to protected routes
    return NextResponse.next();
  }

  // Check if user is authenticated and trying to access public auth routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute && authToken) {
    // User is authenticated but trying to access signin/signup, redirect to account
    const accountUrl = new URL("/account", request.url);
    return NextResponse.redirect(accountUrl);
  }

  // Handle /signup/verify-email route
  if (pathname === "/signup/verify-email") {
    const otpToken = searchParams.get("token");

    if (!otpToken) {
      // No OTP token parameter, redirect to signin
      const signinUrl = new URL("/signin", request.url);
      return NextResponse.redirect(signinUrl);
    }

    if (otpToken === "expired") {
      // OTP token is explicitly marked as expired
      const signinUrl = new URL("/signin", request.url);
      return NextResponse.redirect(signinUrl);
    }

    // Check OTP expiration via API call (30 minute expiration)
    if (authToken) {
      const userID = getUserIdFromToken(authToken);
      if (userID) {
        try {
          const expired = await isOTPExpired(otpToken, userID);
          if (expired) {
            const signinUrl = new URL("/signin", request.url);
            return NextResponse.redirect(signinUrl);
          }
        } catch (error) {
          // If verification fails, redirect to signin for security
          const signinUrl = new URL("/signin", request.url);
          return NextResponse.redirect(signinUrl);
        }
      } else {
        // No valid user ID in token, redirect to signin
        const signinUrl = new URL("/signin", request.url);
        return NextResponse.redirect(signinUrl);
      }
    } else {
      // No auth token available, but OTP verification might not require it
      // You may want to handle this case differently based on your flow
      console.warn("No auth token available for OTP verification");
    }

    // OTP token exists and is valid, allow access
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
