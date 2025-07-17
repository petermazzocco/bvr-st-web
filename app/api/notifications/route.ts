import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

interface SanityNotification {
  _id: string;
  title: string;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  route?: string;
  createdAt: string;
  targetUsers?: string[];
  minimumPoints: number;
  readBy?: ReadEntry[];
  expiresAt?: string;
}

interface ReadEntry {
  _key?: string;
  userId: string;
  readAt: string;
}

const NOTI_QUERY = `*[_type == "notification" && isActive == true] {
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
    expiresAt,
    targetUsers,
    minimumPoints,
    readBy
  } | order(createdAt desc)`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userPoints = searchParams.get("userPoints");
    const userTimezone =
      searchParams.get("userTimezone") || "America/Los_Angeles"; // Default to Pacific

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const notifications: SanityNotification[] =
      await writeClient.fetch(NOTI_QUERY);
    const points = parseInt(userPoints || "0", 10);

    // Get current time in user's timezone
    const userCurrentTime = new Date().toLocaleString("en-US", {
      timeZone: userTimezone,
    });
    const currentTime = new Date(userCurrentTime);

    // Filter notifications based on user criteria
    const filteredNotifications = notifications.filter(
      (notification: SanityNotification) => {
        // Check if notification has expired based on user's timezone
        // If no expiresAt is set, consider it as never expiring (for backwards compatibility)
        if (notification.expiresAt) {
          const expiresAt = new Date(notification.expiresAt);
          if (currentTime >= expiresAt) {
            return false;
          }
        }

        // Check minimum points requirement
        if (notification.minimumPoints > points) {
          return false;
        }

        // Check if user is in target users (if specified)
        if (notification.targetUsers && notification.targetUsers.length > 0) {
          return notification.targetUsers.includes(userId);
        }

        // If no specific targeting, show to all users (who meet point requirement)
        return true;
      },
    );

    // Transform notifications to include image URLs and read status
    const transformedNotifications = filteredNotifications.map(
      (notification: SanityNotification) => {
        const readEntry = notification.readBy?.find(
          (entry: ReadEntry) => entry.userId === userId,
        );

        return {
          ...notification,
          imageUrl: notification.image
            ? urlFor(notification.image)?.width(40).height(40).url()
            : null,
          isRead: !!readEntry,
          readAt: readEntry?.readAt || null,
        };
      },
    );

    return NextResponse.json(transformedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { notificationId, userId } = await request.json();

    if (!notificationId || !userId) {
      return NextResponse.json(
        { error: "Notification ID and User ID are required" },
        { status: 400 },
      );
    }

    // Check current state using writeClient (no CDN)
    const currentNotification: SanityNotification | null =
      await writeClient.fetch(
        `*[_type == "notification" && _id == $notificationId][0] {
        _id,
        title,
        readBy
      }`,
        { notificationId },
      );

    // Check if user has already read this notification
    const userAlreadyRead = currentNotification?.readBy?.some(
      (entry: ReadEntry) => entry.userId === userId,
    );

    if (userAlreadyRead) {
      return NextResponse.json({
        success: true,
        message: "Already marked as read",
      });
    }

    // Mark notification as read
    const readEntry = {
      _key: `${userId}-${Date.now()}`, // Unique key for Sanity
      userId,
      readAt: new Date().toISOString(),
    };

    await writeClient
      .patch(notificationId)
      .setIfMissing({ readBy: [] })
      .append("readBy", [readEntry])
      .commit();

    // Verify the update using writeClient (no CDN)
    const updatedNotification: SanityNotification | null =
      await writeClient.fetch(
        `*[_type == "notification" && _id == $notificationId][0] {
        _id,
        title,
        readBy
      }`,
        { notificationId },
      );

    return NextResponse.json({
      success: true,
      notification: updatedNotification,
      readEntry,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 },
    );
  }
}
