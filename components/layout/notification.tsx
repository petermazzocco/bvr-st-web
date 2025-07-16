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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserId } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  image?: any;
  imageUrl?: string;
  route: string; // Now required
  createdAt: string;
  expiresAt?: string; // Optional for backwards compatibility
  isRead: boolean;
  readAt?: string;
  minimumPoints: number;
}

interface NotificationDropdownProps {
  userPoints?: number;
}

export function NotificationDropdown({
  userPoints = 0,
}: NotificationDropdownProps) {
  const userId = useUserId();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Mutation to mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      const result = await response.json();
      return { notificationId, result };
    },
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["notifications", userId] });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
        userId,
      ]);

      // Optimistically update to mark the notification as read
      queryClient.setQueryData<Notification[]>(
        ["notifications", userId],
        (old) => {
          if (!old) return old;

          return old.map((notification) =>
            notification._id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : notification,
          );
        },
      );

      // Return a context object with the snapshotted value
      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["notifications", userId],
        context?.previousNotifications,
      );
    },
    onSuccess: (data) => {
      // If the API returned the updated notification, update the cache immediately
      if (data.result.notification) {
        queryClient.setQueryData<Notification[]>(
          ["notifications", userId],
          (old) => {
            if (!old) return old;

            return old.map((notification) =>
              notification._id === data.result.notification._id
                ? {
                    ...notification,
                    isRead: true,
                    readAt: data.result.readEntry.readAt,
                    readBy: data.result.notification.readBy,
                  }
                : notification,
            );
          },
        );
      }

      // Also invalidate and refetch after a delay to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      }, 2000);
    },
  });

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read and not currently being marked as read
    if (!notification.isRead && !markAsReadMutation.isPending) {
      markAsReadMutation.mutate(notification._id);
    }

    // Navigate to route (now always exists since it's required)
    router.push(notification.route);
  };

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", userId, userPoints],
    queryFn: async () => {
      if (!userId) return [];

      // Get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await fetch(
        `/api/notifications?userId=${encodeURIComponent(userId)}&userPoints=${encodeURIComponent(userPoints)}&userTimezone=${encodeURIComponent(userTimezone)}`,
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      return response.json();
    },
    enabled: !!userId,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Data is considered fresh for 30 seconds
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
        {isLoading ? (
          <DropdownMenuItem>
            <span className="text-sm text-muted-foreground">Loading...</span>
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
              className={`cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start space-x-3 w-full">
                {notification.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={notification.imageUrl}
                      alt={notification.title}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1 flex-grow min-w-0">
                  <p
                    className={`text-sm truncate ${!notification.isRead ? "font-medium" : "font-normal"}`}
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
                {!notification.isRead && (
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
