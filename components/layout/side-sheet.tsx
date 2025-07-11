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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Collection } from "@/lib/shopify/types";

const helpLinks = [
  { name: "Returns & Exchanges", href: "#", icon: RotateCcw },
  { name: "Terms of Service", href: "#", icon: FileText },
  { name: "Privacy Policy", href: "#", icon: FileText },
  { name: "Contact Us", href: "#", icon: Mail },
];

export function NavSideSheet({
  collections,
}: {
  collections: Collection[] | undefined;
}) {
  const [parentOpen, setParentOpen] = useState(false);

  const handleSubItemClick = () => {
    // Close sheet when clicking on sub-items
    setParentOpen(false);
  };

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
        className="w-1/3 p-0 bg-background border-r shadow-lg"
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
              <Accordion type="multiple" className="w-full">
                {collections?.map((collection, index) => {
                  if (collection.path.startsWith("/collections/")) {
                    return (
                      <AccordionItem
                        key={collection.handle}
                        value={`item-${index}`}
                        className="border-none"
                      >
                        <AccordionTrigger
                          className={`hover:no-underline rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted ${collection.title === "Sale" ? "text-red-600 hover:text-red-700" : "text-foreground hover:text-foreground"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span>{collection.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-2 pt-0">
                          <div className="ml-6 space-y-1">
                            <a
                              key={collection.handle}
                              href={collection.path}
                              className="flex justify-between items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              onClick={handleSubItemClick}
                            >
                              <span>View All</span>{" "}
                              <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }

                  // Regular collection item without sub-collections
                  return (
                    <div key={collection.handle}>
                      <a
                        href={collection.path}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted ${collection.title === "Sale" ? "text-red-600 hover:text-red-700" : "text-foreground hover:text-foreground"}`}
                        onClick={handleDirectLinkClick}
                      >
                        <div className="flex items-center gap-3">
                          <span>{collection.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </a>
                    </div>
                  );
                })}
              </Accordion>
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
