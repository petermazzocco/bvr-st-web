"use client";
import { BellIcon, UserIcon } from "lucide-react";
import { NavSideSheet } from "./side-sheet";
import Link from "next/link";
import { Search } from "./search";
import { CartSheet } from "../cart/cart-sheet";
import { Collection } from "@/lib/shopify/types";
import { getAuthToken } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar({ collections }: { collections: Collection[] }) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = getAuthToken();
    setToken(token);
  }, []);

  console.log(token);

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
        <BellIcon className="h-4" />
        <Link href={isClient && token != undefined ? "/account" : "/signin"}>
          <UserIcon className="h-4" />
        </Link>
        <CartSheet />
      </div>
    </nav>
  );
}
