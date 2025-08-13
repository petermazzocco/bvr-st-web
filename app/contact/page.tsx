import type { Metadata } from "next";
import { ContactCard } from "@/components/cards/contact-card";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with BVR ST CO. Send us a message or apply to become a partner store. We're here to help with any questions.",
  canonical: "https://bvrstco.com/contact",
});

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ContactCard />
    </div>
  );
}
