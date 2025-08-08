import { NavSideSheet } from "./side-sheet";
import Link from "next/link";
import { ProfileDropdown } from "./profile-dropdown";

export async function Navbar() {
  return (
    <nav className="fixed top-0 z-50 bg-transparent text-background grid grid-cols-3 items-center p-2 w-full mix-blend-difference">
      <div className="flex items-center">
        <NavSideSheet />
      </div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <span className="text-lg font-bold">BVR ST CO.</span>
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        <ProfileDropdown />
        {/*<CartSheet />*/}
      </div>
    </nav>
  );
}
