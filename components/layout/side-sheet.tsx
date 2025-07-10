"use client";

import { useState } from "react";
import { Menu, ChevronRight, RotateCcw, FileText, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const collections = [
  { name: "New Arrivals", href: "#" },
  {
    name: "Clothing",
    href: "#",
    subCollections: [
      { name: "T-Shirts", href: "/collections/t-shirts" },
      { name: "Hoodies", href: "/collections/hoodies" },
      { name: "Pants", href: "/collections/pants" },
    ],
  },
  {
    name: "Accessories",
    href: "#",
    subCollections: [
      { name: "Hats", href: "#" },
      { name: "Bags", href: "#" },
      { name: "Belts", href: "#" },
    ],
  },
  {
    name: "Auctions",
    href: "#",
    subCollections: [{ name: "BVRSTR x Labubu", href: "#" }],
  },
  { name: "Sale", href: "#", highlight: true },
];

const helpLinks = [
  { name: "Returns & Exchanges", href: "#", icon: RotateCcw },
  { name: "Terms of Service", href: "#", icon: FileText },
  { name: "Privacy Policy", href: "#", icon: FileText },
  { name: "Contact Us", href: "#", icon: Mail },
];

export function NavSideSheet() {
  const [parentOpen, setParentOpen] = useState(false);

  const handleCollectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    collection: (typeof collections)[number],
  ) => {
    // If it has subcollections, prevent default link behavior
    if ("subCollections" in collection) {
      e.preventDefault();
    } else {
      // Close sheet when clicking on direct links
      setParentOpen(false);
    }
  };

  const handleSubItemClick = () => {
    // Close sheet when clicking on sub-items
    setParentOpen(false);
  };

  return (
    <Sheet open={parentOpen} onOpenChange={setParentOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-60 p-0 bg-background border-r shadow-lg"
      >
        <div className="flex h-full w-60 flex-col">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-left text-xl font-bold">
              Collections
            </SheetTitle>
          </SheetHeader>

          {/* Collections Section */}
          <div className="flex-1 px-2">
            <nav className="space-y-1">
              {collections.map((collection) => {
                if ("subCollections" in collection) {
                  return (
                    <DropdownMenu key={collection.name}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`w-full flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted ${
                            collection.highlight
                              ? "text-red-600 hover:text-red-700"
                              : "text-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span>{collection.name}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-56"
                        side="right"
                        sideOffset={8}
                      >
                        {collection?.subCollections?.map((item) => (
                          <DropdownMenuItem key={item.name} asChild>
                            <a
                              href={item.href}
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={handleSubItemClick}
                            >
                              <span>{item.name}</span>
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                // Regular collection item without sub-collections
                return (
                  <div key={collection.name}>
                    <a
                      href={collection.href}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted ${
                        collection.highlight
                          ? "text-red-600 hover:text-red-700"
                          : "text-foreground hover:text-foreground"
                      }`}
                      onClick={(e) => handleCollectionClick(e, collection)}
                    >
                      <div className="flex items-center gap-3">
                        <span>{collection.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>

          <Separator className="mx-auto" />

          {/* Helper Links Section */}
          <div className="p-4 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Support
            </h3>
            <nav className="space-y-1">
              {helpLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setParentOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
