import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with BVR ST STUDIO.",
  canonical: "https://bvrst.studio/contact",
  image: {
    url: "https://bvrst.studio/opengraph/index.png",
    alt: "BVR ST STUDIO Contact",
  },
});

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-x border-border">
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-20 md:px-12 md:py-28">
          <div className="w-full max-w-md">
            {/* Eyebrow */}
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
              Get In Touch
            </p>

            <h1 className="text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl mb-6">
              Contact Us
            </h1>

            <p className="font-light leading-relaxed text-muted-foreground mb-10">
              Send us a message and we&apos;ll get back to you as soon as
              possible. Please include your name, phone number, email address,
              and a brief description of your inquiry.
            </p>

            {/* Card surface */}
            <div className="rounded-lg border border-border bg-card p-8">
              <a
                href="mailto:info@bvrststudio.com"
                target="_blank"
                className="group"
              >
                <Button
                  variant="default"
                  className="h-12 bg-primary px-8 text-white hover:bg-primary/90 text-xs uppercase tracking-[0.15em] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  Reach Out
                  <ArrowUpRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    size={14}
                    aria-hidden="true"
                  />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
