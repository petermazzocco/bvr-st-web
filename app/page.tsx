"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-end bg-cover bg-center"
      style={{
        backgroundImage: `url('https://cdn.shopify.com/s/files/1/0630/4415/7553/files/IMG_1164.jpg?v=1752789708')`,
      }}
    >
      <div className="mb-44 flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-foreground">
          BVR STR CO
        </h1>
        <Button
          variant="secondary"
          size="lg"
          asChild
          className="flex items-center text-xl justify-center gap-2"
        >
          <Link href="/collections/auctions">
            BID NOW <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
