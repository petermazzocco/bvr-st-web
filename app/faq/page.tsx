import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: "Frequently asked questions about BVR ST STUDIO.",
  canonical: "https://bvrst.studio/faq",
  image: {
    url: "https://bvrst.studio/opengraph/index.png",
    alt: "BVR ST STUDIO FAQ",
  },
});

const faqs = [
  {
    n: "01",
    q: "Are you affiliated with or officially recognized by Oregon State University?",
    a: "While we celebrate and proudly support Oregon State University and all that it has to offer, BVR ST STUDIO operates independently from any official entity, including any official third-party partners of Oregon State and the university itself. We are fans and alumni creating innovative products, services, and experiences for the Beaver community.",
  },
  {
    n: "02",
    q: "Are you an NIL (name, image, and likeness) collective for Oregon State?",
    a: "No, we are not an NIL collective. BVR ST STUDIO is an innovation studio dedicated to creating sustainable competitive advantages through cutting-edge technology and collaboration.",
  },
  {
    n: "03",
    q: "How can I contact BVR ST STUDIO for opportunities, questions and/or support?",
    a: "You can reach us through our contact form, email, or social media channels. We typically respond within 24-48 hours during business days.",
  },
];

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl border-x border-border">
        {/* Header */}
        <section className="border-b border-border px-6 py-12 md:px-12 md:py-20">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Support
          </p>
          <h1 className="mt-4 text-3xl font-thin tracking-[-0.02em] text-foreground md:text-5xl">
            Frequently Asked Questions
          </h1>
        </section>

        {/* FAQ items */}
        <section className="border-b border-border px-6 py-12 md:px-12 md:py-16">
          <div className="flex flex-col divide-y divide-border">
            {faqs.map((item) => (
              <div
                key={item.n}
                className="flex flex-col gap-3 py-10 md:flex-row md:gap-16"
              >
                <span className="shrink-0 font-mono text-sm font-bold text-primary">
                  {item.n}
                </span>
                <div className="flex flex-col gap-3">
                  <p className="text-lg font-medium text-foreground">
                    {item.q}
                  </p>
                  <p className="font-light leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Still have questions?
          </p>
          <p className="mt-4 font-light leading-relaxed text-muted-foreground">
            Don&apos;t hesitate to reach out — we&apos;re here to help.{" "}
            <Link
              href="/contact"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact us here.
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
