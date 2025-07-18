"use client";

import { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Collection } from "@/lib/shopify/types";

const helpLinks = [
  { name: "Returns & Exchanges", href: "/legal/return-policy" },
  { name: "Terms of Service", href: "legal/terms" },
  { name: "Privacy Policy", href: "legal/privacy" },
  { name: "Contact Us", href: "/contact" },
];

export function NavSideSheet({
  collections,
}: {
  collections: Collection[] | undefined;
}) {
  const [parentOpen, setParentOpen] = useState(false);


  const handleDirectLinkClick = () => {
    // Close sheet when clicking on direct links
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
        className="w-full sm:w-2/3 md:w-1/3 p-0 bg-background border-r shadow-lg"
      >
        <div className="flex h-full w-full flex-col">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-left text-xl font-bold">
              Collections
            </SheetTitle>
          </SheetHeader>

          {/* Collections Section */}
          <div className="flex-1 px-2">
            <nav className="space-y-1">
              {collections?.map((collection) => (
                <a
                  key={collection.handle}
                  href={collection.path}
                  id="collection-chosen-button"
                  data-umami-event="Collection chose button"
                  className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted ${collection.title === "Sale" ? "text-red-600 hover:text-red-700" : "text-foreground hover:text-foreground"}`}
                  onClick={handleDirectLinkClick}
                >
                  <div className="flex items-center gap-3">
                    <span>{collection.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </a>
              ))}
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
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setParentOpen(false)}
                  >
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
