"use client";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApiMutation } from "@/hooks/use-api-mutation";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/server/sanity/actions";
import { Notification } from "@/lib/types";
import { useUserId, useAuthToken } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NotificationDropdownProps {
  userPoints?: number;
}

export function NotificationDropdown({
  userPoints = 0,
}: NotificationDropdownProps) {
  const userId = useUserId();
  const authToken = useAuthToken();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const {
    mutate: fetchNotifications,
    data: fetchedNotifications,
    isPending: isLoadingNotifications,
    error: notificationsError,
  } = useApiMutation<Notification[], void>(
    async (_variables: void) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return await getUserNotifications(authToken, userId);
    },
    {
      onError: (error) => {
        console.error("Failed to fetch notifications:", error);
      },
      onSuccess: (data) => {
        setNotifications(data);
      },
    },
  );

  const { mutate: markAsRead, isPending: isMarkingAsRead } = useApiMutation<
    Notification,
    string
  >(
    async (notificationId: string) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return await markNotificationAsRead(authToken, notificationId, userId);
    },
    {
      onError: (error) => {
        console.error("Failed to mark notification as read:", error);
      },
      onSuccess: (updatedNotification) => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === updatedNotification._id
              ? updatedNotification
              : notification,
          ),
        );
      },
    },
  );

  useEffect(() => {
    if (userId && authToken) {
      fetchNotifications();
    }
  }, [userId, authToken, fetchNotifications]);

  useEffect(() => {
    if (fetchedNotifications) {
      setNotifications(fetchedNotifications);
    }
  }, [fetchedNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!isNotificationRead(notification, userId) && !isMarkingAsRead) {
      markAsRead(notification._id);
    }
    router.push(notification.route);
  };

  const isNotificationRead = (
    notification: Notification,
    userId: string | null,
  ): boolean => {
    if (!userId) return false;
    return (
      notification.readBy?.some((record) => record.userId === userId) || false
    );
  };

  const unreadCount = notifications.filter(
    (n) => !isNotificationRead(n, userId),
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoadingNotifications ? (
          <DropdownMenuItem>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </DropdownMenuItem>
        ) : notificationsError ? (
          <DropdownMenuItem>
            <span className="text-sm text-destructive">
              Failed to load notifications
            </span>
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem>
            <span className="text-sm text-muted-foreground">
              No notifications
            </span>
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`cursor-pointer ${!isNotificationRead(notification, userId) ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start space-x-3 w-full">
                {notification.image?.asset?.url && (
                  <div className="flex-shrink-0 w-12 h-12">
                    <img
                      src={notification.image.asset.url}
                      alt={notification.title}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1 flex-grow min-w-0">
                  <p
                    className={`text-sm truncate ${!isNotificationRead(notification, userId) ? "font-medium" : "font-normal"}`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                  {notification.minimumPoints > 0 && (
                    <p className="text-xs text-blue-600">
                      {notification.minimumPoints}+ points required
                    </p>
                  )}
                </div>
                {!isNotificationRead(notification, userId) && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
