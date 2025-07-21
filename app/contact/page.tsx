import type { Metadata } from "next";
import { ContactCard } from "@/components/cards/contact-card";
import { PartnerRequestCard } from "@/components/cards/partner-request-card";
import { generateMetadata as createMetadata } from "@/lib/metadata";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with BVR STR CO. Send us a message or apply to become a partner store. We're here to help with any questions about our streetwear and fashion products.",
  canonical: "https://bvrstrco.com/contact",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="partner">Partner Store Request</TabsTrigger>
        </TabsList>
        <TabsContent value="contact">
          <ContactCard />
        </TabsContent>
        <TabsContent value="partner">
          <PartnerRequestCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
