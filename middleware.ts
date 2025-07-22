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
  response.cookies.set("bvrstrco_auth", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Get the authToken from cookies
  const authToken = request.cookies.get("bvrstrco_auth")?.value;

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

    // Validate that the user actually exists
    const userExists = await validateUserExists(userId, authToken);
    if (!userExists) {
      // User doesn't exist or token is invalid, clear cookie and redirect
      return clearCookieAndRedirect(request);
    }

    // User has valid auth token and exists, allow access to protected routes
    return NextResponse.next();
  }

  // Check if user is authenticated and trying to access public auth routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isPublicRoute && authToken) {
    // Check if token is valid before redirecting to account
    if (isValidJWT(authToken)) {
      // User is authenticated but trying to access signin/signup, redirect to account
      const accountUrl = new URL("/account", request.url);
      return NextResponse.redirect(accountUrl);
    } else {
      // Invalid token, clear it and let them continue to signin/signup
      const response = NextResponse.next();
      response.cookies.set("bvrstrco_auth", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }
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
