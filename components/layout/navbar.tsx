"use client";
import { UserIcon } from "lucide-react";
import { NavSideSheet } from "./side-sheet";
import Link from "next/link";
import { Search } from "./search";
import { CartSheet } from "../cart/cart-sheet";
import { NotificationDropdown } from "./notification";
import { Collection } from "@/lib/shopify/types";
import { useAuth } from "@/components/auth/auth-context";
import { useEffect, useState } from "react";

export function Navbar({ collections }: { collections: Collection[] }) {
  const { isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <NotificationDropdown />
        <Link href={isClient && isAuthenticated ? "/account" : "/signin"}>
          <UserIcon className="h-4" />
        </Link>
        <CartSheet />
      </div>
    </nav>
  );
}
