import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

const NOTI_QUERY = `*[_type == "notification"] {
    _id,
    title,
    image {
      asset->{
        _id,
        url
      }
    },
    route,
    createdAt,
    targetUsers,
    readBy
  } | order(createdAt desc)`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const notifications = await client.fetch(NOTI_QUERY, { userId });

    // Transform notifications to include image URLs
    const transformedNotifications = notifications.map((notification: any) => ({
      ...notification,
      imageUrl: notification.image
        ? urlFor(notification.image).width(40).height(40).url()
        : null,
    }));

    return NextResponse.json(transformedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
