import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { comingSoonFlag, underConstructionFlag } from "./lib/flags";

// Define the routes that require authentication
const PROTECTED_ROUTES = ["/account"];
const PUBLIC_ROUTES = ["/signin", "/signup"];
const BLOCKED_ROUTES = ["/collections", "/products", "/stores"];

// Helper function to get user ID from JWT token
function getUserIdFromToken(token: string): string | null {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload.userid || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Helper function to check if token is valid (properly formatted JWT)
function isValidJWT(token: string): boolean {
  try {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Try to decode the payload
    JSON.parse(atob(parts[1]));
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to validate user exists via API
async function validateUserExists(
  userId: string,
  authToken: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    // If response is not ok, user doesn't exist or auth is invalid
    return response.ok;
  } catch (error) {
    console.error("Error validating user:", error);
    return false;
  }
}

// Helper function to clear invalid auth cookie and redirect to signin
function clearCookieAndRedirect(
  request: NextRequest,
  redirectPath: string = "/signin",
): NextResponse {
  const signinUrl = new URL(redirectPath, request.url);
  const response = NextResponse.redirect(signinUrl);

  // Clear the invalid cookie
  response.cookies.set("bvrstco_auth", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const isUnderConstructionFlag = await underConstructionFlag();
  const isComingSoonFlag = await comingSoonFlag();
  const { pathname, searchParams } = request.nextUrl;

  // Capture UpPromote affiliate tracking parameter
  const response = NextResponse.next();
  const scaRef = searchParams.get("sca_ref");

  if (scaRef) {
    // Set cookie with 30-day expiration for affiliate tracking
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    response.cookies.set("affiliate_ref", scaRef, {
      expires,
      path: "/",
      httpOnly: false, // Allow client-side access if needed
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // First check if site is under construction
  if (isUnderConstructionFlag === true && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Next, check if site is coming soon
  if (isComingSoonFlag === true && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Get the authToken from cookies
  const authToken = request.cookies.get("bvrstco_auth")?.value;

  // Check if current path is a blocked route
  const isBlockedRoute = BLOCKED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect blocked routes to home
  if (isBlockedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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

    // Check if the token is valid (properly formatted JWT)
    if (!isValidJWT(authToken)) {
      // Invalid token format, clear cookie and redirect to signin
      return clearCookieAndRedirect(request);
    }

    // Get user ID from token and validate user exists
    const userId = getUserIdFromToken(authToken);
    if (!userId) {
      // No valid user ID in token, clear cookie and redirect
      return clearCookieAndRedirect(request);
    }

    // TEMPORARILY COMMENT OUT API VALIDATION
    /*
    // Validate that the user actually exists
    const userExists = await validateUserExists(userId, authToken);
    if (!userExists) {
      // User doesn't exist or token is invalid, clear cookie and redirect
      return clearCookieAndRedirect(request);
    }
    */

    // User has valid auth token and exists, allow access to protected routes
    return response;
  }

  // Check if user is authenticated and trying to access public auth routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute && authToken) {
    // Check if token is valid before redirecting to account
    if (isValidJWT(authToken)) {
      // Check if there's a redirect parameter to preserve
      const redirectParam = searchParams.get("redirect");

      if (redirectParam) {
        // User is authenticated and has a redirect, honor it
        const redirectUrl = new URL(redirectParam, request.url);

        return NextResponse.redirect(redirectUrl);
      }
      // User is authenticated but trying to access signin/signup, redirect to account
      const accountUrl = new URL("/account", request.url);

      return NextResponse.redirect(accountUrl);
    } else {
      // Invalid token, clear it and let them continue to signin/signup
      response.cookies.set("bvrstco_auth", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }
  }

  // For all other routes, continue normally
  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
