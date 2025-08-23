import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCollections } from "@/lib/shopify";
import { getAllPartneredStores } from "@/server/vendor/actions";

const helpLinks = [
  { name: "Become A Partner", href: "/contact" },
  { name: "Returns & Exchanges", href: "/legal/return" },
  { name: "Terms of Service", href: "legal/terms" },
  { name: "Privacy Policy", href: "legal/privacy" },
  { name: "Contact Us", href: "/contact" },
];

export async function NavSideSheet() {
  const collections = await getCollections();
  const partners = await getAllPartneredStores();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-background">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:w-2/4 md:w-1/4 p-0 bg-background border-r shadow-lg"
      >
        <div className="flex h-full w-full flex-col">
          <SheetHeader className="p-4 pb-4">
            <SheetTitle className="text-left text-xl">Collections</SheetTitle>
          </SheetHeader>

          {/* Collections Section */}
          <div className="flex-1 px-2">
            <nav className="space-y-1">
              {collections
                ?.filter((collection) => collection.seo.title !== "All")
                .map((collection) => (
                  <a
                    key={collection.handle}
                    href={collection.path}
                    id="collection-chosen-button"
                    data-umami-event="Collection chose button"
                    className={`flex items-center justify-between rounded-lg px-2 py-2 text-xs font-medium hover:underline ${collection.title === "Sale" ? "text-red-600 hover:text-red-700" : "text-foreground hover:text-foreground"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{collection.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </a>
                ))}
            </nav>

            {/* Partner Stores Section */}
            {partners && partners.length > 0 && (
              <div className="pt-4">
                <h3 className="mb-2 p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Partner Stores
                </h3>
                <nav className="space-y-1">
                  {partners?.map((vendor) => (
                    <a
                      key={vendor._id}
                      href={`/stores/${vendor.storeName}`}
                      className="flex items-center justify-between rounded-lg px-2 py-2 text-xs font-medium hover:underline"
                    >
                      <div className="flex items-center gap-3">
                        <span>{vendor.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Helper Links Section */}
          <div className="p-4 pt-4">
            <nav className="space-y-1">
              {helpLinks.map((link) => {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between rounded-lg py-2 text-xs font-medium hover:underline"
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
