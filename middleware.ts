import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { underConstructionFlag } from "./lib/flags";

export async function middleware(request: NextRequest) {
  const isUnderConstructionFlag = await underConstructionFlag();

  const response = NextResponse.next();

  if (isUnderConstructionFlag === true && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
