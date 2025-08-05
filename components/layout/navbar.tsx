import { UserIcon } from "lucide-react";
import { NavSideSheet } from "./side-sheet";
import Link from "next/link";
import { CartSheet } from "../cart/cart-sheet";
import { Collection } from "@/lib/shopify/types";
import { Vendor } from "@/lib/types";
import { cookies } from "next/headers";

export async function Navbar({
  collections,
  partners,
}: {
  collections: Collection[];
  partners: Vendor[];
}) {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("bvrstco_auth");
  const authToken = authTokenCookie?.value || null;

  return (
    <nav className=" grid grid-cols-3 items-center p-2 w-full bg-background text-foreground ">
      <div className="flex items-center">
        <NavSideSheet
          collections={collections}
          partners={partners}
          className="text-foreground"
        />
      </div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <span className="text-lg font-bold">BVR ST CO.</span>
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        <Link href={!authToken ? "/account" : "/signin"}>
          <UserIcon className="h-4" />
        </Link>
        <CartSheet />
      </div>
    </nav>
  );
}
