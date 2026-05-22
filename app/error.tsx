"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-x border-border">
        <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Error 500
          </p>
          <h1 className="mt-6 text-[3rem] font-thin leading-[0.9] tracking-[-0.02em] text-foreground sm:text-[5rem]">
            Something went wrong
          </h1>
          <p className="mt-5 max-w-md font-light leading-relaxed text-muted-foreground">
            An unexpected error occurred. You can try again, or head back home.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => reset()}
              className="group h-12 bg-primary px-8 text-white hover:bg-primary/90"
            >
              <ArrowLeft
                className="me-2 transition-transform group-hover:-translate-x-0.5"
                size={14}
                aria-hidden="true"
              />
              <span className="text-xs uppercase tracking-[0.15em]">
                Try Again
              </span>
            </Button>
            <Button
              asChild
              variant="outline"
              className="group h-12 px-8"
            >
              <Link
                href="/"
                className="flex items-center justify-center text-xs uppercase tracking-[0.15em]"
              >
                <span>Back to Home</span>
                <ArrowUpRight
                  className="ms-2 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  size={14}
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
