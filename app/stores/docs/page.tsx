import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Partner Store Documentation",
  description: "Learn how to become a BVR STR CO partner store. Complete documentation for integrating your Shopify store, setting up webhooks, and managing your partnership.",
  canonical: "https://bvrstrco.com/stores/docs",
});

export default function Page() {
  return <div className="container mx-auto px-4 py-8"></div>;
}
