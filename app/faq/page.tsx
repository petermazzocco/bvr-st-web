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

export default function Page() {
  return (
    <div className="min-h-screen pt-16">
      <div className=" py-16 ">
        <div className="bg-background max-w-4xl mx-auto p-4 rounded-lg text-left border shadow-sm">
          <h2 className="text-lg text-left font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col text-xs text-muted-foreground leading-relaxed gap-10 mb-16">
            <div>
              <p className="font-bold text-foreground mb-2">
                Are you affiliated with or officially recognized by any
                university?
              </p>
              <p>
                While we celebrate and proudly support college athletics and
                all that it has to offer, BVR ST STUDIO operates independently
                from any official entity, including any official third-party
                partners or any university itself. We are fans and alumni
                creating innovative products, services, and experiences for
                the college athletics community.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                Are you an NIL (name, image, and likeness) collective for any
                university?
              </p>
              <p>
                No, we are not an NIL collective. BVR ST STUDIO is a innovation
                studio dedicated to creative sustainable competitive advantages
                through cutting-edge technology and collaboration.
              </p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-2">
                How can I contact BVR ST STUDIO for opportunities, questions
                and/or support?
              </p>
              <p>
                You can reach us through our contact form, email, or social
                media channels. We typically respond within 24-48 hours during
                business days.
              </p>
            </div>

            <div className="italic mt-8">
              Have more questions?{" "}
              <Link href="/contact" className="underline">
                Don&apos;t hesitate to reach out, we&apos;re here to help.{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
