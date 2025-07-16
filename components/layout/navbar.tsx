"use client";
import { UserIcon } from "lucide-react";
import { NavSideSheet } from "./side-sheet";
import Link from "next/link";
import { Search } from "./search";
import { CartSheet } from "../cart/cart-sheet";
import { NotificationDropdown } from "./notification";
import { Collection } from "@/lib/shopify/types";
import {
  useAuth,
  useAuthToken,
  useUserId,
} from "@/components/auth/auth-context";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserPoints } from "@/server/user/actions";

export function Navbar({ collections }: { collections: Collection[] }) {
  const { isAuthenticated } = useAuth();
  const userId = useUserId();
  const authToken = useAuthToken();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user points when user is authenticated
  const { data: userPoints = 0 } = useQuery({
    queryKey: ["userPoints", userId],
    queryFn: async () => {
      if (!userId) return 0;

      const result = await getUserPoints(authToken || undefined, userId);

      if (result.success && result.data !== undefined) {
        return result.data;
      }

      // Return 0 if there's an error or no data
      console.warn("Failed to fetch user points:", result.error);
      return 0;
    },
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  return (
    <nav className="grid grid-cols-3 items-center p-2 border-b w-full bg-background">
      <div className="flex items-center">
        <NavSideSheet collections={collections} />
      </div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <span className="text-lg font-bold">BVRSTR</span>
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        <Search />
        {isAuthenticated && <NotificationDropdown userPoints={userPoints} />}
        <Link href={isClient && isAuthenticated ? "/account" : "/signin"}>
          <UserIcon className="h-4" />
        </Link>
        <CartSheet />
      </div>
    </nav>
  );
}
