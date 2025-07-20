"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center text-background">
          <h1 className="text-8xl font-bold tracking-wider">BVR STR CO</h1>
          <p>
            <strong>
              The culture shift Beaver fans have been waiting for.
            </strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="default"
              size="lg"
              asChild
              className="flex items-center text-xl justify-center gap-2"
            >
              <Link href="/about">READ MORE</Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="flex items-center text-xl justify-center gap-2"
            >
              <Link href="/signup">SIGN UP</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
