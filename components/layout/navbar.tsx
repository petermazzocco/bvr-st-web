"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 bg-transparent text-background grid grid-cols-3 items-center py-2 px-5 w-full mix-blend-difference  transition-transform duration-150",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="flex items-center">
        {/*<Link href="/">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src="/assets/icons/BEAVER-ST-CO_ICON-05.svg"
              alt="Avatar"
              className="p-1"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Link>*/}
      </div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <Image
            src="/assets/BEAVER-ST-CO_HORIZONTAL-02.svg"
            alt="BVR ST CO."
            width={170}
            height={50}
          />
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        {/*<CartSheet />*/}
      </div>
    </nav>
  );
}
