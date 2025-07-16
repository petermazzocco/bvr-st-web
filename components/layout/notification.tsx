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
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  image?: any;
  imageUrl?: string;
  route?: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
}

export function NotificationDropdown() {
  const userId = useUserId();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    if (notification.route) {
      router.push(notification.route);
    }
  };

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    enabled: !!userId,
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
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
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
