import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, redirectUrl } = await request.json();

    if (!token) {
      console.log("❌ No token provided");
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("bvrstco_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    const response = {
      success: true,
      redirectUrl: redirectUrl || "/account",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Set auth token error:", error);
    return NextResponse.json(
      { error: "Failed to set authentication token" },
      { status: 500 },
    );
  }
}
