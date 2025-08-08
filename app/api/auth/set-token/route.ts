import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Set-token API called");
    console.log(
      "📝 Request headers:",
      Object.fromEntries(request.headers.entries()),
    );

    const { token, redirectUrl } = await request.json();

    console.log("📝 Set-token called with:", {
      tokenPresent: !!token,
      tokenLength: token?.length,
      tokenPrefix: token ? token.substring(0, 30) + "..." : "null",
      redirectUrl,
    });

    if (!token) {
      console.log("❌ No token provided");
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    console.log("🍪 Setting cookie...");
    const cookieStore = await cookies();
    cookieStore.set("bvrstco_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("✅ Cookie set successfully");

    const response = {
      success: true,
      redirectUrl: redirectUrl || "/account",
    };

    console.log("📤 Returning response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Set auth token error:", error);
    return NextResponse.json(
      { error: "Failed to set authentication token" },
      { status: 500 },
    );
  }
}
