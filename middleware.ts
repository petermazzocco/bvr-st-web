import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { underConstructionFlag } from "./lib/flags";

const BLOCKED_ROUTES = ["/collections", "/products", "/stores"];

export async function middleware(request: NextRequest) {
  const isUnderConstructionFlag = await underConstructionFlag();
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  if (isUnderConstructionFlag === true && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isBlockedRoute = BLOCKED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isBlockedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
